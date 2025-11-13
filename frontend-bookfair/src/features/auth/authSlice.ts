import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  type SignupRequest,
  type SignupResponseData,
  type ApiEnvelope,
  type LoginRequest,
  type LoginResponseData,
} from "../../lib/api";

export interface AuthState {
  user: SignupResponseData | null;
  token: string | null;
  tokenType: string | null;
  userId: number | null;
  role: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
  lastMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  tokenType: null,
  userId: null,
  role: null,
  username: null,
  loading: false,
  error: null,
  lastMessage: null,
};

export const signup = createAsyncThunk<
  ApiEnvelope<SignupResponseData>,
  SignupRequest,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const res = await signupApi(payload);
    if (String(res.statusCode) !== "201" && res.status !== "SUCCESS") {
      return rejectWithValue(res.message || "Signup failed");
    }
    return res;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Signup failed";
    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk<
  ApiEnvelope<LoginResponseData>,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await loginApi(payload);
    if (String(res.statusCode) !== "200" && res.status !== "SUCCESS") {
      return rejectWithValue(res.message || "Login failed");
    }
    return res;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Login failed";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.lastMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<ApiEnvelope<SignupResponseData>>) => {
        state.loading = false;
        state.user = action.payload.data;
        state.lastMessage = action.payload.message || "User registered successfully";
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Signup failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<ApiEnvelope<LoginResponseData>>) => {
        state.loading = false;
        state.lastMessage = action.payload.message || "Login successful";
        const d = action.payload.data;
        state.token = d.accessToken;
        state.tokenType = d.tokenType;
        state.userId = d.userId;
        state.role = d.role;
        state.username = d.username;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Login failed";
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;

export default authSlice.reducer;
