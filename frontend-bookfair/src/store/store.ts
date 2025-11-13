import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

function loadAuthState() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return { auth: parsed } as any;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadAuthState(),
});

// Persist a minimal slice of auth to localStorage
store.subscribe(() => {
  try {
    const s = store.getState();
    const { token, tokenType, userId, role, username, profile } = (s as any).auth || {};
    const payload = { token, tokenType, userId, role, username, profile };
    if (token) {
      localStorage.setItem("auth", JSON.stringify(payload));
    } else {
      localStorage.removeItem("auth");
    }
  } catch {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
