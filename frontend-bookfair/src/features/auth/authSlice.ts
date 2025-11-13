import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  changePasswordApi,
  getMeApi,
  updateProfileApi,
  type SignupRequest,
  type SignupResponseData,
  type ApiEnvelope,
  type LoginRequest,
  type LoginResponseData,
  type ChangePasswordRequest,
  type MeResponseData,
  type UpdateProfileRequest,
} from "../../lib/api";

export interface AuthState {
  user: SignupResponseData | null;
  token: string | null;
  tokenType: string | null;
  userId: number | null;
  role: string | null;
  username: string | null;
  profile: MeResponseData | null;
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
  profile: null,
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

// Change Password
export const changePassword = createAsyncThunk<
  ApiEnvelope<null>,
  ChangePasswordRequest,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/changePassword", async (payload, { getState, rejectWithValue }) => {
  try {
    const { token, tokenType } = (getState() as { auth: AuthState }).auth;
    const res = await changePasswordApi(payload, token, tokenType);
    
    if (String(res.statusCode) !== "200" && res.status !== "SUCCESS") {
      return rejectWithValue(res.message || "Password change failed");
    }
    return res;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Password change failed";
    return rejectWithValue(message);
  }
});

// Fetch profile (me)
export const fetchProfile = createAsyncThunk<
  ApiEnvelope<MeResponseData>,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/fetchProfile", async (_: void, { getState, rejectWithValue }) => {
  try {
    const { token, tokenType } = (getState() as { auth: AuthState }).auth;
    const res = await getMeApi(token, tokenType);
    if (String(res.statusCode) !== "200" || res.status !== "SUCCESS") {
      return rejectWithValue(res.message || "Failed to load profile");
    }
    return res;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Failed to load profile";
    return rejectWithValue(message);
  }
});

// Update profile
export const updateProfile = createAsyncThunk<
  ApiEnvelope<MeResponseData>,
  UpdateProfileRequest,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/updateProfile", async (payload, { getState, rejectWithValue }) => {
  try {
    const { token, tokenType } = (getState() as { auth: AuthState }).auth;
    const res = await updateProfileApi(payload, token, tokenType);
    if (String(res.statusCode) !== "200" || res.status !== "SUCCESS") {
      return rejectWithValue(res.message || "Failed to update profile");
    }
    return res;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Failed to update profile";
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
    logout(state) {
      state.user = null;
      state.token = null;
      state.tokenType = null;
      state.userId = null;
      state.role = null;
      state.username = null;
      state.loading = false;
      state.error = null;
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
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action: PayloadAction<ApiEnvelope<null>>) => {
        state.loading = false;
        state.lastMessage = action.payload.message || "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Password change failed";
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ApiEnvelope<MeResponseData>>) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to load profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<ApiEnvelope<MeResponseData>>) => {
        state.loading = false;
        state.profile = action.payload.data;
        state.username = action.payload.data.username;
        state.lastMessage = action.payload.message || "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to update profile";
      });
  },
});

export const { clearError, clearMessage, logout } = authSlice.actions;

export default authSlice.reducer;
