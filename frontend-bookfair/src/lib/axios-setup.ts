import { api } from "./api";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";

export function setupAxiosInterceptors(store: Store<RootState>) {
  // Inject Authorization header from Redux auth state
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    const tokenType = state.auth.tokenType || "Bearer";
    if (token) {
      config.headers = config.headers ?? {};
      if (!("Authorization" in config.headers)) {
        (config.headers as Record<string, string>)["Authorization"] = `${tokenType} ${token}`;
      }
    }
    return config;
  });

  // Global 401 handler: log out and redirect to login
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      // Handle CORS/network errors where response is blocked or server unreachable
      if (!status) {
        try {
          toast.error("Can't reach server. Check CORS or server status.");
        } catch {}
        return Promise.reject(error);
      }
      if (status === 401) {
        const url: string = (error?.config?.url || "").toString();
        const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/signup");
        // If it's a login/signup attempt, let the caller handle invalid credentials
        if (isAuthEndpoint) {
          return Promise.reject(error);
        }
        // Only treat as session-expired if we actually have a token (i.e., user was logged in)
        const state = store.getState();
        const hadToken = !!state.auth.token;
        if (!hadToken) {
          return Promise.reject(error);
        }
        try {
          store.dispatch(logout());
        } catch {}
        try {
          toast.error("Session expired. Please log in again.");
        } catch {}
        try {
          if (typeof window !== "undefined") {
            // Avoid redirect loop if already on /login
            const path = window.location.pathname;
            if (!path.includes("/login")) {
              window.location.assign("/login");
            }
          }
        } catch {}
      }
      return Promise.reject(error);
    },
  );
}
