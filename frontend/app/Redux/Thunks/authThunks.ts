import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  userId: string;
}

// ── Register ───────────────────────────────────────────
export const registerUser = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      credentials,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Registration failed",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Login ──────────────────────────────────────────────
export const loginUser = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Logout ─────────────────────────────────────────────
export const logoutUser = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(error.response.data.message || "Logout failed");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

// ── Refresh Access Token ───────────────────────────────
export const refreshAccessToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response) {
      return rejectWithValue(
        error.response.data.message || "Token refresh failed",
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
