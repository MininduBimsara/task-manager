# Task Manager Frontend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Technology Stack & Dependencies](#technology-stack--dependencies)
5. [Configuration](#configuration)
6. [State Management (Redux)](#state-management-redux)
   - [Store Configuration](#store-configuration)
   - [Slicers](#slicers)
   - [Thunks](#thunks)
   - [Typed Hooks](#typed-hooks)
   - [Provider](#provider)
7. [TypeScript Types & Interfaces](#typescript-types--interfaces)
8. [API Integration](#api-integration)
9. [Authentication Flow](#authentication-flow)
10. [Task Management Flow](#task-management-flow)
11. [Styling](#styling)
12. [Development Guide](#development-guide)

---

## Overview

This is the frontend application for the Task Manager, built with **Next.js 16**, **React 19**, **TypeScript**, and **Redux Toolkit**. It communicates with the backend REST API over HTTP using **Axios** with cookie-based authentication (`withCredentials: true`). State management is handled entirely by **Redux Toolkit** with async thunks for API calls.

### Key Features

- ✅ Next.js 16 App Router architecture
- ✅ React 19 with Server & Client Components
- ✅ Redux Toolkit for centralized state management
- ✅ Redux Persist for session persistence across refreshes
- ✅ Async thunks for all API operations
- ✅ Cookie-based authentication (HttpOnly tokens managed by backend)
- ✅ Full TypeScript with strict mode
- ✅ Tailwind CSS 4 for styling
- ✅ Mobile responsive UI (card-based layout on small screens)
- ✅ Toast notifications via react-toastify
- ✅ Typed Redux hooks for type-safe component integration
- ✅ Axios HTTP client with typed error handling
- ✅ Vercel-ready deployment

---

## Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Next.js App Router                      │
│                  (layout.tsx / page.tsx)                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 ReduxProvider                         │  │
│  │              (Client Component)                       │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │               React Components                  │  │  │
│  │  │                                                  │  │  │
│  │  │  useAppDispatch()  ──►  dispatch(thunk())       │  │  │
│  │  │  useAppSelector()  ◄──  read state              │  │  │
│  │  └──────────────┬───────────────────────────────────┘  │  │
│  │                 │                                      │  │
│  │                 ▼                                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Redux Store                        │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌──────────────────┐  ┌─────────────────────┐  │  │  │
│  │  │  │   Auth Slice     │  │   Task Slice        │  │  │  │
│  │  │  │  - userId        │  │  - tasks[]          │  │  │  │
│  │  │  │  - isAuthenticated│  │  - selectedTask    │  │  │  │
│  │  │  │  - loading       │  │  - loading          │  │  │  │
│  │  │  │  - error         │  │  - error            │  │  │  │
│  │  │  └──────────────────┘  └─────────────────────┘  │  │  │
│  │  └──────────────┬───────────────────────────────────┘  │  │
│  │                 │                                      │  │
│  │                 ▼                                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              Async Thunks                       │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌──────────────────┐  ┌─────────────────────┐  │  │  │
│  │  │  │  Auth Thunks     │  │  Task Thunks        │  │  │  │
│  │  │  │  - registerUser  │  │  - fetchTasks       │  │  │  │
│  │  │  │  - loginUser     │  │  - fetchTaskById    │  │  │  │
│  │  │  │  - logoutUser    │  │  - fetchTasksByStatus│  │  │  │
│  │  │  │  - refreshToken  │  │  - createTask       │  │  │  │
│  │  │  │                  │  │  - updateTask       │  │  │  │
│  │  │  │                  │  │  - deleteTask       │  │  │  │
│  │  │  └──────────────────┘  └─────────────────────┘  │  │  │
│  │  └──────────────┬───────────────────────────────────┘  │  │
│  │                 │                                      │  │
│  └─────────────────┼────────────────────────────────────┘  │
│                    │                                       │
└────────────────────┼───────────────────────────────────────┘
                     │  Axios (withCredentials: true)
                     ▼
         ┌───────────────────────┐
         │   Backend REST API    │
         │  http://localhost:5000│
         │                       │
         │  /auth/*  (Auth)      │
         │  /api/*   (Tasks)     │
         └───────────────────────┘
```

### Data Flow

1. **Component** dispatches a thunk via `useAppDispatch()`
2. **Thunk** makes an Axios HTTP request to the backend API
3. **Backend** processes the request and returns a JSON response (sets/reads HttpOnly cookies for auth)
4. **Thunk** returns the response data (fulfilled) or error message (rejected)
5. **Slice** reducer updates the relevant state based on the thunk lifecycle action (`pending` → `fulfilled` / `rejected`)
6. **Component** re-renders via `useAppSelector()` reading the updated state

---

## Project Structure

```
frontend/
├── app/
│   ├── globals.css                    # Global styles + mobile responsive media queries
│   ├── layout.tsx                     # Root layout (wraps children with ReduxProvider)
│   ├── page.tsx                       # Home page (redirects to /login)
│   ├── login/page.tsx                 # Login page
│   ├── register/page.tsx              # Registration page
│   ├── dashboard/page.tsx             # Dashboard page
│   │
│   └── Redux/
│       ├── hooks.ts                   # Typed useAppDispatch & useAppSelector hooks
│       ├── provider.tsx               # ReduxProvider with PersistGate & rehydration
│       │
│       ├── Store/
│       │   └── store.ts              # Redux store + persistor configuration
│       │
│       ├── Slicers/
│       │   ├── authSlice.ts          # Auth state: userId, isAuthenticated, loading, error
│       │   └── taskSlice.ts          # Task state: tasks[], selectedTask, loading, error
│       │
│       └── Thunks/
│           ├── authThunks.ts         # Async thunks: register, login, logout, refresh
│           └── taskThunks.ts         # Async thunks: CRUD operations + filter by status
│
├── components/
│   ├── Dashboard.tsx                  # Main task dashboard (table/card layout)
│   ├── Login.tsx                      # Login form component
│   ├── Register.tsx                   # Registration form component
│   ├── ViewTaskModal.tsx              # View task details modal
│   ├── UpdateTaskModal.tsx            # Edit task modal
│   └── DeleteTaskModal.tsx            # Delete confirmation modal
│
├── .env.example                       # Environment variable template
├── eslint.config.mjs                  # ESLint configuration
├── next.config.ts                     # Next.js configuration
├── package.json                       # Dependencies & scripts
├── postcss.config.mjs                 # PostCSS configuration (Tailwind)
├── tsconfig.json                      # TypeScript configuration (strict mode)
└── FRONTEND_DOCUMENTATION.md          # This file
```

---

## Technology Stack & Dependencies

### Core

| Package      | Version  | Purpose                         |
| ------------ | -------- | ------------------------------- |
| `next`       | `16.1.6` | React framework with App Router |
| `react`      | `19.2.3` | UI library                      |
| `react-dom`  | `19.2.3` | React DOM renderer              |
| `typescript` | `^5`     | Static type checking            |

### State Management

| Package            | Version   | Purpose                                                       |
| ------------------ | --------- | ------------------------------------------------------------- |
| `@reduxjs/toolkit` | `^2.11.2` | Redux Toolkit (createSlice, createAsyncThunk, configureStore) |
| `react-redux`      | `^9.2.0`  | React bindings for Redux                                      |
| `redux`            | `^5.0.1`  | Core Redux library                                            |
| `redux-persist`    | `^6`      | Persist auth state across page refreshes (localStorage)       |

### HTTP, Validation & UI

| Package          | Version   | Purpose                               |
| ---------------- | --------- | ------------------------------------- |
| `axios`          | `^1.13.5` | HTTP client with typed error handling |
| `joi`            | `^18.0.2` | Client-side input validation          |
| `react-toastify` | `^11`     | Toast notification system             |

### Styling (Dev)

| Package                | Version | Purpose                     |
| ---------------------- | ------- | --------------------------- |
| `tailwindcss`          | `^4`    | Utility-first CSS framework |
| `@tailwindcss/postcss` | `^4`    | PostCSS plugin for Tailwind |

---

## Configuration

### Environment Variables

| Variable              | Required | Description                                     |
| --------------------- | -------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Backend API base URL (no hardcoded fallback)    |
| `NODE_ENV`            | No       | Environment mode (`development` / `production`) |

> `NEXT_PUBLIC_` prefix is required for Next.js to expose variables to client-side code.

### TypeScript Configuration

The project uses strict TypeScript with the following key settings:

- **`strict: true`** — Enables all strict type-checking options
- **`moduleResolution: "bundler"`** — Modern module resolution for Next.js
- **`jsx: "react-jsx"`** — JSX transform
- **`paths: { "@/*": ["./*"] }`** — Path alias for imports

### NPM Scripts

```bash
npm run dev       # Start development server (next dev)
npm run build     # Production build (next build)
npm run start     # Start production server (next start)
npm run lint      # Run ESLint
```

---

## State Management (Redux)

### Store Configuration

**File:** `app/Redux/Store/store.ts`

The store is configured using Redux Toolkit's `configureStore` with **redux-persist** for session persistence:

```typescript
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Auth state is persisted to localStorage
const authPersistConfig = { key: "auth", storage };

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
          "persist/FLUSH",
        ],
        ignoredPaths: ["tasks.tasks"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
```

**Exported Types & Objects:**

| Export        | Description                                           |
| ------------- | ----------------------------------------------------- |
| `store`       | Redux store instance                                  |
| `persistor`   | Redux-persist persistor (used for purging on logout)  |
| `RootState`   | `ReturnType<typeof store.getState>` — Full state tree |
| `AppDispatch` | `typeof store.dispatch` — Dispatch with thunk support |

---

### Slicers

#### Auth Slice (`app/Redux/Slicers/authSlice.ts`)

Manages authentication state for the current user session.

**State Interface:**

```typescript
interface AuthState {
  userId: string | null; // Authenticated user's ID
  isAuthenticated: boolean; // Whether the user is logged in
  loading: boolean; // API request in progress
  error: string | null; // Error message from failed requests
}
```

**Initial State:**

```typescript
{
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}
```

**Synchronous Actions:**

| Action           | Description                               |
| ---------------- | ----------------------------------------- |
| `clearAuthError` | Resets `error` to `null`                  |
| `resetAuth`      | Returns the entire slice to initial state |

**Async Thunk Handling (extraReducers):**

| Thunk                | Pending         | Fulfilled                              | Rejected                                          |
| -------------------- | --------------- | -------------------------------------- | ------------------------------------------------- |
| `registerUser`       | `loading: true` | Sets `userId`                          | Sets `error`                                      |
| `loginUser`          | `loading: true` | Sets `userId`, `isAuthenticated: true` | Sets `error`                                      |
| `logoutUser`         | `loading: true` | Resets to `initialState`               | Sets `error`                                      |
| `refreshAccessToken` | `loading: true` | Sets `userId`, `isAuthenticated: true` | Resets `userId` & `isAuthenticated`, sets `error` |

---

#### Task Slice (`app/Redux/Slicers/taskSlice.ts`)

Manages the task list and individual task selection.

**State Interface:**

```typescript
interface TaskState {
  tasks: Task[]; // Array of all user's tasks
  selectedTask: Task | null; // Single task for detail/edit view
  loading: boolean; // API request in progress
  error: string | null; // Error message from failed requests
}
```

**Task Interface:**

```typescript
interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}
```

> The `Task` interface mirrors the backend MongoDB `Task` model schema. The `status` field is a union type matching the three valid statuses.

**Initial State:**

```typescript
{
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
}
```

**Synchronous Actions:**

| Action              | Description                               |
| ------------------- | ----------------------------------------- |
| `clearTaskError`    | Resets `error` to `null`                  |
| `clearSelectedTask` | Resets `selectedTask` to `null`           |
| `resetTasks`        | Returns the entire slice to initial state |

**Async Thunk Handling (extraReducers):**

| Thunk                | Pending         | Fulfilled                                                                    | Rejected     |
| -------------------- | --------------- | ---------------------------------------------------------------------------- | ------------ |
| `fetchTasks`         | `loading: true` | Replaces `tasks[]` with response array                                       | Sets `error` |
| `fetchTaskById`      | `loading: true` | Sets `selectedTask`                                                          | Sets `error` |
| `fetchTasksByStatus` | `loading: true` | Replaces `tasks[]` with filtered response array                              | Sets `error` |
| `createTask`         | `loading: true` | Appends new task to `tasks[]`                                                | Sets `error` |
| `updateTask`         | `loading: true` | Replaces matching task in `tasks[]` and updates `selectedTask` if applicable | Sets `error` |
| `deleteTask`         | `loading: true` | Removes task from `tasks[]` and clears `selectedTask` if it was deleted      | Sets `error` |

---

### Thunks

All thunks use `createAsyncThunk` with full TypeScript generics:

```typescript
createAsyncThunk<ReturnType, ArgType, { rejectValue: string }>;
```

Every thunk sends requests with `{ withCredentials: true }` to include HttpOnly cookies (JWT access token and refresh token are managed server-side).

#### Auth Thunks (`app/Redux/Thunks/authThunks.ts`)

| Thunk                | HTTP Method | Endpoint         | Argument                              | Return Type                           |
| -------------------- | ----------- | ---------------- | ------------------------------------- | ------------------------------------- |
| `registerUser`       | `POST`      | `/auth/register` | `{ email: string, password: string }` | `{ message: string, userId: string }` |
| `loginUser`          | `POST`      | `/auth/login`    | `{ email: string, password: string }` | `{ message: string, userId: string }` |
| `logoutUser`         | `POST`      | `/auth/logout`   | `void`                                | `{ message: string }`                 |
| `refreshAccessToken` | `POST`      | `/auth/refresh`  | `void`                                | `{ message: string, userId: string }` |

**Error Handling Pattern:**

```typescript
} catch (err) {
  const error = err as AxiosError<{ message: string }>;
  if (error.response) {
    return rejectWithValue(error.response.data.message || "Fallback message");
  }
  return rejectWithValue("An unexpected error occurred");
}
```

All thunks cast the caught error to `AxiosError<{ message: string }>` and extract the backend error message from `error.response.data.message`. If no response exists (e.g., network failure), a generic fallback message is returned.

---

#### Task Thunks (`app/Redux/Thunks/taskThunks.ts`)

| Thunk                | HTTP Method | Endpoint                    | Argument                                                                                      | Return Type                           |
| -------------------- | ----------- | --------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| `fetchTasks`         | `GET`       | `/api/tasks`                | `void`                                                                                        | `{ tasks: Task[], message: string }`  |
| `fetchTaskById`      | `GET`       | `/api/tasks/:id`            | `string` (taskId)                                                                             | `{ task: Task, message: string }`     |
| `fetchTasksByStatus` | `GET`       | `/api/tasks/status/:status` | `string` (status)                                                                             | `{ tasks: Task[], message: string }`  |
| `createTask`         | `POST`      | `/api/tasks`                | `{ title: string, description?: string, status?: "pending" \| "in-progress" \| "completed" }` | `{ task: Task, message: string }`     |
| `updateTask`         | `PUT`       | `/api/tasks/:id`            | `{ taskId: string, data: { title?, description?, status? } }`                                 | `{ task: Task, message: string }`     |
| `deleteTask`         | `DELETE`    | `/api/tasks/:id`            | `string` (taskId)                                                                             | `{ taskId: string, message: string }` |

> The `deleteTask` thunk manually constructs its return value by combining `taskId` from the argument with `message` from the response, since the backend only returns `{ message }` on deletion.

---

### Typed Hooks

**File:** `app/Redux/hooks.ts`

Pre-typed hooks that should be used **throughout the application** instead of plain `useDispatch` and `useSelector`:

```typescript
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./Store/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Why typed hooks?**

- `useAppDispatch` returns a dispatch function that understands thunk actions (not just plain actions)
- `useAppSelector` provides autocomplete and type checking for the full state tree
- Prevents the need to import `RootState` and `AppDispatch` in every component

**Usage Example:**

```typescript
"use client";
import { useAppDispatch, useAppSelector } from "@/app/Redux/hooks";
import { fetchTasks } from "@/app/Redux/Thunks/taskThunks";

export default function TaskList() {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // ...render tasks
}
```

---

### Provider

**File:** `app/Redux/provider.tsx`

A client component that wraps the application with Redux `<Provider>` and handles redux-persist rehydration using `useSyncExternalStore` (avoids the `setState-in-useEffect` lint violation):

```tsx
"use client";
import { useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./Store/store";

function usePersistorRehydrated() {
  return useSyncExternalStore(
    (cb) => {
      const unsub = persistor.subscribe(cb);
      return () => unsub();
    },
    () => persistor.getState().bootstrapped,
    () => false,
  );
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isRehydrated = usePersistorRehydrated();
  if (!isRehydrated) return null; // Wait for localStorage state to load
  return <Provider store={store}>{children}</Provider>;
}
```

> The provider waits until redux-persist has rehydrated the auth state from localStorage before rendering the app tree. This prevents flash-of-unauthenticated-content on page refresh.

---

## TypeScript Types & Interfaces

### Auth Types

```typescript
// Thunk argument for login & register
interface AuthCredentials {
  email: string;
  password: string;
}

// Backend response for auth operations
interface AuthResponse {
  message: string;
  userId: string;
}

// Auth slice state
interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### Task Types

```typescript
// Task entity (mirrors backend MongoDB model)
interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Thunk argument for creating a task
interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed";
}

// Thunk argument for updating a task
interface UpdateTaskPayload {
  taskId: string;
  data: {
    title?: string;
    description?: string;
    status?: "pending" | "in-progress" | "completed";
  };
}

// Task slice state
interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}
```

### Store Types

```typescript
// Inferred from store configuration
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
```

---

## API Integration

### Base URL

All API requests use the environment variable with **no hardcoded fallback**:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
```

> This must be set in `.env.local` (locally) or in Vercel's environment variable settings (production).

### Request Configuration

Every Axios request includes `{ withCredentials: true }` to ensure HttpOnly cookies (JWT access token and refresh token) are sent with cross-origin requests. The backend CORS configuration allows credentials from the frontend origin.

### Backend Endpoint Mapping

| Frontend Thunk       | HTTP     | Backend Route               | Backend Controller |
| -------------------- | -------- | --------------------------- | ------------------ |
| `registerUser`       | `POST`   | `/auth/register`            | `registerUser`     |
| `loginUser`          | `POST`   | `/auth/login`               | `loginUser`        |
| `logoutUser`         | `POST`   | `/auth/logout`              | `logoutUser`       |
| `refreshAccessToken` | `POST`   | `/auth/refresh`             | `refreshToken`     |
| `fetchTasks`         | `GET`    | `/api/tasks`                | `getTasks`         |
| `fetchTaskById`      | `GET`    | `/api/tasks/:id`            | `getTaskById`      |
| `fetchTasksByStatus` | `GET`    | `/api/tasks/status/:status` | `getTasksByStatus` |
| `createTask`         | `POST`   | `/api/tasks`                | `createTask`       |
| `updateTask`         | `PUT`    | `/api/tasks/:id`            | `updateTask`       |
| `deleteTask`         | `DELETE` | `/api/tasks/:id`            | `deleteTask`       |

### Error Response Format

The backend consistently returns errors as:

```json
{ "message": "Error description" }
```

Thunks extract this via `error.response.data.message` and pass it to `rejectWithValue()`, which populates the slice's `error` state.

---

## Authentication Flow

### Registration

```
User fills form → dispatch(registerUser({ email, password }))
  → POST /auth/register
  → Backend creates user, returns { message, userId }
  → authSlice sets userId
```

### Login

```
User fills form → dispatch(loginUser({ email, password }))
  → POST /auth/login
  → Backend validates credentials, sets HttpOnly cookies (token + refreshToken)
  → Returns { message, userId }
  → authSlice sets userId, isAuthenticated = true
```

### Token Refresh

```
Access token expired → dispatch(refreshAccessToken())
  → POST /auth/refresh (refresh token sent via HttpOnly cookie automatically)
  → Backend rotates tokens, sets new cookies
  → Returns { message, userId }
  → authSlice maintains isAuthenticated = true
  → On failure: isAuthenticated = false, userId = null
```

### Logout

```
User clicks logout → dispatch(logoutUser())
  → POST /auth/logout
  → Backend clears cookies, invalidates refresh token in DB
  → Returns { message }
  → authSlice resets to initialState
```

> **Important:** Tokens are never stored in Redux state or localStorage. The backend manages tokens exclusively via HttpOnly cookies, making them inaccessible to JavaScript and safe from XSS attacks.

---

## Task Management Flow

### Fetch All Tasks

```
Component mounts → dispatch(fetchTasks())
  → GET /api/tasks (auth cookie sent automatically)
  → taskSlice replaces tasks[] with response
```

### Filter by Status

```
User selects filter → dispatch(fetchTasksByStatus("pending"))
  → GET /api/tasks/status/pending
  → taskSlice replaces tasks[] with filtered results
```

### Create Task

```
User submits form → dispatch(createTask({ title, description, status }))
  → POST /api/tasks
  → taskSlice appends new task to tasks[]
```

### Update Task

```
User edits task → dispatch(updateTask({ taskId, data: { title, status } }))
  → PUT /api/tasks/:id
  → taskSlice replaces matching task in tasks[]
  → Also updates selectedTask if it matches
```

### Delete Task

```
User confirms delete → dispatch(deleteTask(taskId))
  → DELETE /api/tasks/:id
  → taskSlice removes task from tasks[]
  → Clears selectedTask if it was the deleted task
```

### View Single Task

```
User clicks task → dispatch(fetchTaskById(taskId))
  → GET /api/tasks/:id
  → taskSlice sets selectedTask
```

---

## Components

### Dashboard (`components/Dashboard.tsx`)

Main task management view with:

- Task creation form (inline expandable panel)
- Task table with grid layout (desktop) / card layout (mobile)
- Search/filter functionality
- View, Edit, Delete actions per task
- Logout button (dispatches `logoutUser`, purges persist, redirects)

### Login & Register (`components/Login.tsx`, `components/Register.tsx`)

Authentication forms with:

- Joi client-side validation
- Toast notifications for success/error
- Links to switch between login and register

### Modals

| Component             | Purpose                                |
| --------------------- | -------------------------------------- |
| `ViewTaskModal.tsx`   | Read-only task detail view             |
| `UpdateTaskModal.tsx` | Edit form (title, description, status) |
| `DeleteTaskModal.tsx` | Confirmation dialog for deletion       |

All modals use the `modal-body` CSS class for mobile responsiveness.

---

## Styling & Responsiveness

The application uses **Tailwind CSS 4** with custom responsive overrides in `globals.css`:

- **PostCSS plugin:** `@tailwindcss/postcss` (configured in `postcss.config.mjs`)
- **Import method:** `@import "tailwindcss"` in `globals.css`
- **Dark mode:** Automatic via `prefers-color-scheme` media query
- **CSS variables:** `--background` and `--foreground` for theme colors
- **Component styling:** Inline styles with CSS class hooks for responsive overrides

### Mobile Responsive Breakpoints

| Breakpoint | Behavior                                                      |
| ---------- | ------------------------------------------------------------- |
| `≤ 768px`  | Header stacks, search full-width, table → cards, modals adapt |
| `≤ 480px`  | Buttons full-width, reduced padding, smaller heading          |

---

## Deployment

### Vercel (Recommended)

1. Import the GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your deployed backend URL
4. Deploy — Vercel auto-detects Next.js

---

## Development Guide

### Prerequisites

- Node.js (v18+)
- npm
- Backend server running (URL configured via `NEXT_PUBLIC_API_URL` in `.env.local`)

### Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your backend URL

# Start development server
npm run dev
```

The app runs on `http://localhost:3000` by default.

### Adding a New Slice

1. Create the slice file in `app/Redux/Slicers/`:

   ```typescript
   import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

   interface MyState {
     /* ... */
   }
   const initialState: MyState = {
     /* ... */
   };

   const mySlice = createSlice({
     name: "myFeature",
     initialState,
     reducers: {
       /* synchronous actions */
     },
     extraReducers: (builder) => {
       /* handle thunks */
     },
   });

   export const {
     /* actions */
   } = mySlice.actions;
   export default mySlice.reducer;
   ```

2. Register the reducer in `app/Redux/Store/store.ts`:

   ```typescript
   import myReducer from "../Slicers/mySlice";

   export const store = configureStore({
     reducer: {
       auth: authReducer,
       tasks: taskReducer,
       myFeature: myReducer, // Add here
     },
   });
   ```

### Adding a New Thunk

1. Create the thunk file in `app/Redux/Thunks/`:

   ```typescript
   import { createAsyncThunk } from "@reduxjs/toolkit";
   import axios, { AxiosError } from "axios";

   const API_BASE_URL =
     process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

   export const myThunk = createAsyncThunk<
     ReturnType,
     ArgType,
     { rejectValue: string }
   >("myFeature/action", async (arg, { rejectWithValue }) => {
     try {
       const response = await axios.get<ReturnType>(
         `${API_BASE_URL}/api/endpoint`,
         { withCredentials: true },
       );
       return response.data;
     } catch (err) {
       const error = err as AxiosError<{ message: string }>;
       if (error.response) {
         return rejectWithValue(error.response.data.message || "Failed");
       }
       return rejectWithValue("An unexpected error occurred");
     }
   });
   ```

2. Handle the thunk in the corresponding slice's `extraReducers`.

### Using Redux in Components

Always use the typed hooks from `app/Redux/hooks.ts`:

```typescript
"use client";
import { useAppDispatch, useAppSelector } from "@/app/Redux/hooks";
import { someThunk } from "@/app/Redux/Thunks/someThunks";
import { someAction } from "@/app/Redux/Slicers/someSlice";

export default function MyComponent() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.myFeature);

  const handleAction = () => {
    dispatch(someThunk(args));
  };

  const handleSync = () => {
    dispatch(someAction());
  };

  // ...
}
```

> **Reminder:** Components using Redux hooks must be Client Components (marked with `"use client"`).
