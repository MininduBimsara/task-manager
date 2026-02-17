import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
} from "../Thunks/authThunks";

// ── Types ──────────────────────────────────────────────
export interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ── Initial State ──────────────────────────────────────
const initialState: AuthState = {
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ── Slice ──────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    resetAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Register ─────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ userId: string; message: string }>) => {
          state.loading = false;
          state.userId = action.payload.userId;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Login ────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ userId: string; message: string }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Logout ───────────────────────────────────────
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Refresh Token ────────────────────────────────
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshAccessToken.fulfilled,
        (state, action: PayloadAction<{ userId: string; message: string }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
        },
      )
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userId = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
