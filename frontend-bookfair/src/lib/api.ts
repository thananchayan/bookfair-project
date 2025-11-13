import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!baseURL) {
  // Fallback to avoid crashes in dev if env missing
  // Prefer explicit env configuration
  console.warn("VITE_API_BASE_URL is not set. Falling back to http://localhost:8087");
}

export const api = axios.create({
  baseURL: baseURL || "http://localhost:8087",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Types for signup request/response
export type Profession = "VENDOR" | "PUBLISHER";

export interface SignupRequest {
  username: string;
  password: string;
  phonenumber: string;
  address: string;
  profession: Profession;
}

export interface ApiEnvelope<T> {
  type: string;
  status: "SUCCESS" | "FAILED" | string;
  statusCode: string | number;
  message: string;
  data: T;
}

export interface SignupResponseData {
  id: number;
  username: string;
  phonenumber: string;
  address: string;
  profession: Profession;
  date: string;
}

export async function signupApi(payload: SignupRequest) {
  const { data } = await api.post<ApiEnvelope<SignupResponseData>>("/auth/signup", payload);
  return data;
}

// Login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  tokenType: string; // e.g., "Bearer"
  userId: number;
  role: string; // e.g., "ROLE_VENDOR"
  username: string;
}

export async function loginApi(payload: LoginRequest) {
  const { data } = await api.post<ApiEnvelope<LoginResponseData>>("/auth/login", payload);
  return data;
}
