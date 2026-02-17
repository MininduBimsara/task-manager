# Task Manager Backend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Design Patterns](#design-patterns)
5. [Technology Stack & Dependencies](#technology-stack--dependencies)
6. [Configuration](#configuration)
7. [Database Models](#database-models)
8. [Authentication System](#authentication-system)
9. [Task Management System](#task-management-system)
10. [Middleware](#middleware)
11. [Input Validation](#input-validation)
12. [API Endpoints](#api-endpoints)
13. [Security Features](#security-features)
14. [Error Handling](#error-handling)
15. [Development Guide](#development-guide)

---

## Overview

This is a comprehensive Task Manager backend API built with Node.js, Express, TypeScript, and MongoDB. The application implements a **Service Repository Pattern** for clean architecture, strict type safety with TypeScript, and robust security features including JWT-based authentication with HttpOnly cookies, refresh token rotation, rate limiting, and input validation with Joi.

### Key Features

- ✅ User authentication (register, login, logout, **token refresh**)
- ✅ Task CRUD operations with ownership verification
- ✅ JWT access token (15 min) + refresh token (7 days) with **rotation**
- ✅ **HttpOnly cookies** for both access & refresh tokens
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ **Rate limiting** on all routes (stricter on auth endpoints)
- ✅ **Joi validation** schemas for all input
- ✅ **Helmet** HTTP security headers (CSP, X-Frame-Options, etc.)
- ✅ **NoSQL injection prevention** via custom sanitize middleware
- ✅ **CORS** configured with restricted origins
- ✅ Service Repository Pattern for separation of concerns
- ✅ Full TypeScript with strict mode
- ✅ ES Modules (modern JavaScript)
- ✅ Secure error handling (no stack trace leakage)

---

## Architecture

### Service Repository Pattern

The application follows a **layered architecture** with additional middleware for validation & security:

```
┌─────────────────────────────────────────────┐
│          Middleware Layer                     │
│  (Security, Auth, Validation, Rate Limiting) │
│  - auth.middleware.ts                        │
│  - validate.middleware.ts                    │
│  - rateLimiter.middleware.ts                 │
│  + helmet, cors, mongoSanitize (in server)   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Controllers Layer                   │
│  (HTTP Request/Response Handling)            │
│  - auth.controller.ts                        │
│  - task.controller.ts                        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Services Layer                      │
│  (Business Logic & Validation)               │
│  - auth.service.ts                           │
│  - task.service.ts                           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Repositories Layer                  │
│  (Database Operations)                       │
│  - user.repository.ts                        │
│  - task.repository.ts                        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│          Models Layer                        │
│  (Database Schemas)                          │
│  - user.model.ts                             │
│  - task.model.ts                             │
└─────────────────────────────────────────────┘
```

### Benefits of this Architecture

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Easy to mock dependencies and write unit tests
- **Maintainability**: Changes in one layer don't affect others
- **Reusability**: Services and repositories can be reused across controllers
- **Type Safety**: Full TypeScript support with interfaces and DTOs

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts                       # MongoDB connection configuration
│   │   └── env.ts                      # Environment variables setup
│   │
│   ├── models/
│   │   ├── user.model.ts               # User Mongoose schema
│   │   └── task.model.ts               # Task Mongoose schema
│   │
│   ├── repositories/
│   │   ├── user.repository.ts          # User database operations
│   │   └── task.repository.ts          # Task database operations
│   │
│   ├── services/
│   │   ├── auth.service.ts             # Authentication business logic
│   │   └── task.service.ts             # Task business logic
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts          # Auth HTTP handlers
│   │   └── task.controller.ts          # Task HTTP handlers
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts          # JWT authentication middleware
│   │   ├── validate.middleware.ts      # Joi validation middleware
│   │   └── rateLimiter.middleware.ts   # Rate limiting middleware
│   │
│   ├── validators/
│   │   ├── auth.validator.ts           # Joi schemas for auth endpoints
│   │   └── task.validator.ts           # Joi schemas for task endpoints
│   │
│   ├── routes/
│   │   ├── auth.routes.ts              # Authentication routes
│   │   └── task.routes.ts              # Task routes
│   │
│   └── server.ts                       # Express server entry point
│
├── .env.example                        # Environment variables template
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── Task_Manager_API.postman_collection.json  # API testing collection
```

---

## Design Patterns

### 1. Service Repository Pattern

**Repository Layer**: Abstracts database operations

```typescript
class UserRepository {
  async create(email: string, hashedPassword: string): Promise<IUser>;
  async findByEmail(email: string): Promise<IUser | null>;
  async findById(userId: string): Promise<IUser | null>;
  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<IUser | null>;
}
```

**Service Layer**: Contains business logic and validation

```typescript
class AuthService {
  async register(registerData: RegisterDTO): Promise<AuthResponse>;
  async login(loginData: LoginDTO): Promise<AuthResponse>;
  async refresh(refreshToken: string): Promise<AuthResponse>;
  async logout(userId: string): Promise<AuthResponse>;
  private async hashPassword(password: string): Promise<string>;
  private generateToken(userId: string): string;
  private generateRefreshToken(): string;
}
```

**Controller Layer**: Handles HTTP requests/responses

```typescript
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await authService.register({ email, password });
  res.status(201).json({ message: result.message });
};
```

### 2. Middleware Chain Pattern

Each route passes through a chain of middleware before reaching the controller:

```
Request → Rate Limiter → Joi Validation → Auth Middleware → Controller
```

### 3. DTO Pattern (Data Transfer Objects)

Type-safe data structures for API communication:

```typescript
export interface RegisterDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  userId?: string;
}
```

---

## Technology Stack & Dependencies

### Core Technologies

| Technology        | Purpose                                                               |
| ----------------- | --------------------------------------------------------------------- |
| **Node.js**       | JavaScript runtime for server-side execution                          |
| **Express.js v5** | Web application framework for building REST APIs                      |
| **TypeScript v5** | Statically typed superset of JavaScript for type safety               |
| **MongoDB**       | NoSQL document database for data storage                              |
| **Mongoose v9**   | MongoDB ODM (Object Data Modeling) for schema definitions and queries |

### Production Dependencies

Each library and what it does:

| Package                  | Version | What It Does                                                                                                                                                                                                                                                  |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`express`**            | ^5.2.1  | **Web framework** — Handles HTTP requests, routing, middleware, and responses. The backbone of the API server.                                                                                                                                                |
| **`mongoose`**           | ^9.2.1  | **MongoDB ODM** — Provides schema-based modeling for MongoDB. Defines data shapes (User, Task), handles queries, validation, and relationships.                                                                                                               |
| **`bcryptjs`**           | ^3.0.3  | **Password hashing** — Hashes passwords using the bcrypt algorithm with configurable salt rounds (10). Makes stored passwords unreadable and timing-attack resistant.                                                                                         |
| **`jsonwebtoken`**       | ^9.0.3  | **JWT authentication** — Generates and verifies JSON Web Tokens. Used for short-lived access tokens (15 min) that authenticate API requests.                                                                                                                  |
| **`cookie-parser`**      | ^1.4.7  | **Cookie parsing** — Parses HTTP cookies from incoming requests into `req.cookies`. Required to read the JWT and refresh token from HttpOnly cookies.                                                                                                         |
| **`cors`**               | ^2.8.6  | **Cross-Origin Resource Sharing** — Controls which frontend origins can make requests to the backend. Configured to allow only the `FRONTEND_URL` origin with credentials (cookies).                                                                          |
| **`helmet`**             | ^8.1.0  | **HTTP security headers** — Automatically sets 15+ security-related HTTP headers including Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, etc. Protects against clickjacking, MIME sniffing, and other attacks. |
| **`joi`**                | ^18.0.2 | **Input validation** — Defines declarative validation schemas. Used to validate request bodies (email format, password strength, title length, valid status values) before they reach the controller. Returns structured error messages.                      |
| **`express-rate-limit`** | ^8.2.1  | **Rate limiting** — Limits the number of requests per IP address within a time window. Prevents brute-force attacks on login (10 req/15 min on auth routes) and DDoS on the API (100 req/15 min globally).                                                    |
| **`dotenv`**             | ^17.3.1 | **Environment variables** — Loads variables from `.env` file into `process.env`. Keeps secrets (JWT_SECRET, MONGO_URI) out of source code.                                                                                                                    |
| **`nodemon`**            | ^3.1.11 | **Development auto-restart** — Watches source files for changes and automatically restarts the server during development.                                                                                                                                     |

### Dev Dependencies

| Package          | What It Does                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| **`typescript`** | TypeScript compiler — converts `.ts` files to JavaScript                                            |
| **`tsx`**        | TypeScript execution engine — runs `.ts` files directly without a compile step (replaces `ts-node`) |
| **`@types/*`**   | TypeScript type definitions for all dependencies (`express`, `cors`, `bcryptjs`, etc.)              |

### TypeScript Configuration

- **Module System**: ES Modules (`module: "nodenext"`, `target: "esnext"`)
- **Strict Mode**: Enabled for maximum type safety
- **Isolated Modules**: Each file can be transpiled independently
- **Source Maps**: Enabled for debugging
- **Strict Index Access**: `noUncheckedIndexedAccess` enabled
- **Exact Optional Properties**: `exactOptionalPropertyTypes` enabled

---

## Configuration

### Environment Variables

Create a `.env` file in the backend root (see `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/task-manager

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_change_this

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Server Entry Point (`src/server.ts`)

The server applies middleware in this order:

```typescript
app.use(helmet()); // 1. Security headers
app.use(cors({ origin, credentials })); // 2. CORS with restricted origin
app.use(express.json({ limit: "10kb" })); // 3. Body parser (10kb limit)
app.use(cookieParser()); // 4. Cookie parser
app.use(mongoSanitize); // 5. NoSQL injection prevention (custom, Express 5 compatible)
app.use(globalLimiter); // 6. Global rate limiting (100 req/15min)

app.use("/auth", authRoutes); // Auth routes (+ auth rate limiter)
app.use("/api", taskRoutes); // Task routes (+ auth middleware)
```

---

## Database Models

### User Model (`src/models/user.model.ts`)

```typescript
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});
```

| Field          | Type   | Details                                                    |
| -------------- | ------ | ---------------------------------------------------------- |
| `email`        | String | Unique, indexed for fast authentication lookups            |
| `password`     | String | Stores bcrypt-hashed password (never plaintext)            |
| `refreshToken` | String | Stores SHA-256 hashed refresh token (null when logged out) |
| `createdAt`    | Date   | Auto-set timestamp on user registration                    |

### Task Model (`src/models/task.model.ts`)

```typescript
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

| Field         | Type     | Details                                                      |
| ------------- | -------- | ------------------------------------------------------------ |
| `userId`      | ObjectId | Foreign key to User (indexed for fast user-specific queries) |
| `title`       | String   | Required, 1-200 characters                                   |
| `description` | String   | Optional, max 1000 characters                                |
| `status`      | String   | One of: `"pending"`, `"in-progress"`, `"completed"`          |
| `createdAt`   | Date     | Auto-set timestamp                                           |
| `updatedAt`   | Date     | Updated on every modification                                |

---

## Authentication System

### Authentication Flow

```
1. Register ─── POST /auth/register
   │  Body: { email, password }
   │  Joi validates email format + password strength
   │  Password hashed with bcryptjs (10 salt rounds)
   └─► 201 Created { userId }

2. Login ─── POST /auth/login
   │  Body: { email, password }
   │  Compares password with stored hash
   │  Generates JWT access token (15 min) + refresh token (7 days)
   │  Sets two HttpOnly cookies: "token" and "refreshToken"
   └─► 200 OK { userId }

3. Refresh ─── POST /auth/refresh
   │  Reads refresh token from HttpOnly cookie
   │  Verifies against SHA-256 hash stored in DB
   │  Issues new access token + rotates refresh token
   └─► 200 OK { userId }

4. Protected Route ─── GET /api/tasks
   │  Auth middleware reads "token" cookie
   │  Verifies JWT signature
   │  Attaches userId to request
   └─► Controller processes request

5. Logout ─── POST /auth/logout
   │  Requires authentication
   │  Invalidates refresh token in database (sets to null)
   │  Clears both cookies
   └─► 200 OK
```

### Refresh Token Security

- **Generation**: `crypto.randomBytes(40)` — 80 hex character cryptographically secure token
- **Storage**: Only the **SHA-256 hash** is stored in the database (not the raw token)
- **Rotation**: A new refresh token is issued on every refresh (old one invalidated)
- **Cookie Path**: Refresh token cookie has `path: "/auth/refresh"` — only sent to the refresh endpoint
- **Invalidation**: Set to `null` in database on logout

### Cookie Configuration

| Cookie           | HttpOnly | Secure (prod) | SameSite | MaxAge | Path          |
| ---------------- | -------- | ------------- | -------- | ------ | ------------- |
| `token` (access) | ✅       | ✅            | strict   | 15 min | /             |
| `refreshToken`   | ✅       | ✅            | strict   | 7 days | /auth/refresh |

---

## Task Management System

### TaskRepository (`src/repositories/task.repository.ts`)

All task queries filter by **both `taskId` and `userId`** to enforce ownership:

```typescript
// Ownership enforced at query level — no way to bypass
async findByIdAndUserId(taskId: string, userId: string): Promise<ITask | null> {
  return await Task.findOne({ _id: taskId, userId });
}

async update(taskId: string, userId: string, updateData: UpdateTaskDTO): Promise<ITask | null> {
  return await Task.findOneAndUpdate(
    { _id: taskId, userId },  // Query: must match both task ID AND user ID
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true },
  );
}

async delete(taskId: string, userId: string): Promise<ITask | null> {
  return await Task.findOneAndDelete({ _id: taskId, userId });
}
```

### TaskService (`src/services/task.service.ts`)

Business logic layer with validation:

- Validates userId, title (required, max 200 chars), description (max 1000 chars), status (enum)
- Checks task ownership before every update/delete
- Returns structured `TaskResponse` objects

---

## Middleware

### Auth Middleware (`src/middleware/auth.middleware.ts`)

Fully typed with TypeScript. Exports `AuthenticatedRequest` interface used by all controllers:

```typescript
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized - No token provided" });
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };
  req.userId = decoded.userId;
  next();
};
```

### Validation Middleware (`src/middleware/validate.middleware.ts`)

Factory function that takes a Joi schema and returns Express middleware:

```typescript
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return ALL errors, not just the first
      stripUnknown: true, // Remove fields not in the schema
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      res
        .status(400)
        .json({ message: "Validation failed", errors: errorMessages });
      return;
    }
    next();
  };
};
```

### Rate Limiter Middleware (`src/middleware/rateLimiter.middleware.ts`)

| Limiter         | Scope            | Limit        | Window     | Applied To                                       |
| --------------- | ---------------- | ------------ | ---------- | ------------------------------------------------ |
| `globalLimiter` | All routes       | 100 requests | 15 minutes | `server.ts` (globally)                           |
| `authLimiter`   | Auth routes only | 10 requests  | 15 minutes | `/auth/register`, `/auth/login`, `/auth/refresh` |

---

## Input Validation

### Auth Validation Schemas (`src/validators/auth.validator.ts`)

**Register Schema:**

| Field      | Rules                                                                               |
| ---------- | ----------------------------------------------------------------------------------- |
| `email`    | Valid email format, required                                                        |
| `password` | Min 8 chars, max 128 chars, at least 1 uppercase + 1 lowercase + 1 number, required |

**Login Schema:**

| Field      | Rules                        |
| ---------- | ---------------------------- |
| `email`    | Valid email format, required |
| `password` | Required                     |

### Task Validation Schemas (`src/validators/task.validator.ts`)

**Create Task Schema:**

| Field         | Rules                                                   |
| ------------- | ------------------------------------------------------- |
| `title`       | 1-200 characters, trimmed, required                     |
| `description` | Max 1000 characters, trimmed, optional                  |
| `status`      | One of: `pending`, `in-progress`, `completed`, optional |

**Update Task Schema:**

Same rules as create, but all fields are optional. At least one field must be provided.

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Auth | Rate Limited | Joi Validated | Description                  |
| ------ | ---------------- | ---- | ------------ | ------------- | ---------------------------- |
| POST   | `/auth/register` | No   | ✅ 10/15min  | ✅            | Register a new user          |
| POST   | `/auth/login`    | No   | ✅ 10/15min  | ✅            | Login and receive tokens     |
| POST   | `/auth/refresh`  | No   | ✅ 10/15min  | —             | Refresh access token         |
| POST   | `/auth/logout`   | ✅   | —            | —             | Logout and invalidate tokens |

---

#### POST /auth/register

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error Responses:**

- `400 Bad Request`: Validation failed (missing email, weak password, invalid email format)
- `409 Conflict`: User already exists
- `429 Too Many Requests`: Rate limit exceeded (10 attempts per 15 min)

---

#### POST /auth/login

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful",
  "userId": "507f1f77bcf86cd799439011"
}
```

_Sets two HttpOnly cookies: `token` (15 min) and `refreshToken` (7 days)_

**Error Responses:**

- `400 Bad Request`: Validation failed
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

---

#### POST /auth/refresh

**No request body** — reads refresh token from HttpOnly cookie automatically.

**Response (200 OK):**

```json
{
  "message": "Token refreshed successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

_Rotates both cookies: new access token + new refresh token_

**Error Responses:**

- `401 Unauthorized`: Missing or invalid refresh token
- `429 Too Many Requests`: Rate limit exceeded

---

#### POST /auth/logout

**No request body.** Requires authentication (access token cookie).

**Response (200 OK):**

```json
{
  "message": "Logout successful"
}
```

_Clears both cookies and invalidates refresh token in database._

---

### Task Endpoints

All task endpoints require authentication (JWT access token in cookie).

| Method | Endpoint                    | Joi Validated | Description                          |
| ------ | --------------------------- | ------------- | ------------------------------------ |
| GET    | `/api/tasks`                | —             | Get all tasks for authenticated user |
| GET    | `/api/tasks/:id`            | —             | Get a specific task by ID            |
| GET    | `/api/tasks/status/:status` | —             | Filter tasks by status               |
| POST   | `/api/tasks`                | ✅            | Create a new task                    |
| PUT    | `/api/tasks/:id`            | ✅            | Update an existing task              |
| DELETE | `/api/tasks/:id`            | —             | Delete a task                        |

---

#### GET /api/tasks

**Response (200 OK):**

```json
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f191e810c19729de860ea",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for backend",
      "status": "in-progress",
      "createdAt": "2026-02-16T10:00:00.000Z",
      "updatedAt": "2026-02-16T11:30:00.000Z"
    }
  ]
}
```

---

#### POST /api/tasks

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs for backend",
  "status": "pending"
}
```

Only `title` is required. `description` and `status` are optional.

**Response (201 Created):**

```json
{
  "message": "Task created successfully",
  "task": { ... }
}
```

---

#### PUT /api/tasks/:id

**Request Body (all fields optional, at least one required):**

```json
{
  "title": "Updated title",
  "status": "completed"
}
```

**Response (200 OK):**

```json
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

---

#### DELETE /api/tasks/:id

**Response (200 OK):**

```json
{
  "message": "Task deleted successfully"
}
```

---

## Security Features

### 1. Password Security

- **bcryptjs** hashing with **10 salt rounds** (2¹⁰ = 1,024 iterations)
- Plaintext passwords never stored
- **Timing-safe** comparison via `bcrypt.compare()`

### 2. JWT & Refresh Token Security

- **Access token**: Short-lived (15 min), stored in HttpOnly cookie
- **Refresh token**: Long-lived (7 days), cryptographically random, SHA-256 hashed in DB
- **Token rotation**: New refresh token on every use, old one invalidated
- **Cookie flags**: `httpOnly`, `secure` (production), `sameSite: "strict"`

### 3. Rate Limiting (express-rate-limit)

- **Global**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 10 requests per 15 minutes per IP (prevents brute-force)
- Returns `429 Too Many Requests` with human-readable message

### 4. Input Validation (Joi)

- **Register**: Email format validation, password strength (8+ chars, uppercase, lowercase, number)
- **Task create/update**: Title length (1-200), description length (max 1000), status enum
- **stripUnknown**: Removes unexpected fields from request body
- **abortEarly: false**: Returns all validation errors at once

### 5. NoSQL Injection Prevention (Custom Sanitize Middleware)

A custom Express 5-compatible middleware (`src/middleware/sanitize.middleware.ts`) that recursively strips keys starting with `$` or containing `.` from `req.body`, `req.params`, and `req.query` to prevent operators like `{"$gt": ""}` from being injected into MongoDB queries. Unlike `express-mongo-sanitize`, it mutates objects in-place instead of reassigning `req.query` (which is read-only in Express 5).

### 6. HTTP Security Headers (Helmet)

Automatically sets 15+ headers including:

- `Content-Security-Policy` — Prevents XSS and data injection
- `X-Frame-Options` — Prevents clickjacking
- `X-Content-Type-Options` — Prevents MIME sniffing
- `Strict-Transport-Security` — Forces HTTPS
- `X-Permitted-Cross-Domain-Policies` — Restricts Adobe cross-domain policies

### 7. CORS Configuration

```typescript
cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

- Restricts API access to the configured frontend origin
- `credentials: true` allows cookies to be sent cross-origin

### 8. Authorization

- Every task query filters by **both `taskId` AND `userId`** at the database level
- Users can never access, modify, or delete another user's tasks
- Auth middleware on all `/api/*` routes

### 9. Error Handling

- Stack traces are **never** sent to clients
- Errors logged server-side with `console.error()`
- Generic messages returned to clients

### 10. Request Body Size Limit

```typescript
app.use(express.json({ limit: "10kb" }));
```

Limits request body to 10kb to prevent large payload attacks.

---

## Error Handling

### Error Response Format

All errors return consistent JSON:

```json
{
  "message": "Human-readable error description"
}
```

Validation errors include an additional `errors` array:

```json
{
  "message": "Validation failed",
  "errors": [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  ]
}
```

### HTTP Status Codes

| Code | Meaning               | Example                            |
| ---- | --------------------- | ---------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE        |
| 201  | Created               | Successful POST (resource created) |
| 400  | Bad Request           | Validation failed, invalid input   |
| 401  | Unauthorized          | Missing/invalid JWT token          |
| 404  | Not Found             | Resource doesn't exist             |
| 409  | Conflict              | User already exists                |
| 429  | Too Many Requests     | Rate limit exceeded                |
| 500  | Internal Server Error | Unexpected server error            |

---

## Development Guide

### Setup Instructions

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Configure Environment**

```bash
cp .env.example .env
# Edit .env with your values (MONGO_URI, JWT_SECRET, etc.)
```

3. **Start MongoDB**

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (connection string in .env)
```

4. **Run Development Server**

```bash
npm start
```

Uses `nodemon` with `tsx` to watch for file changes and auto-restart.

### TypeScript Compilation

```bash
# Type-check without emitting
npx tsc --noEmit

# Compile TypeScript
npm run build
```

### Testing with cURL

**Register:**

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

**Login (save cookies):**

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}' \
  -c cookies.txt
```

**Refresh token:**

```bash
curl -X POST http://localhost:5000/auth/refresh \
  -b cookies.txt -c cookies.txt
```

**Create a task:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"My Task","description":"Task details","status":"pending"}'
```

**Get all tasks:**

```bash
curl -X GET http://localhost:5000/api/tasks -b cookies.txt
```

### Testing with Postman

Import `Task_Manager_API.postman_collection.json` into Postman. The collection includes:

- All auth endpoints (register, login, refresh, logout)
- All task endpoints (CRUD + filter by status)
- Error test cases (validation, auth, rate limiting)

---

## Summary

This backend implements a production-ready Task Manager API with:

✅ **Clean Architecture**: Service Repository Pattern  
✅ **Type Safety**: Full TypeScript with strict mode  
✅ **Authentication**: JWT access tokens (15 min) + refresh tokens (7 days) with rotation  
✅ **Authorization**: User-specific data access with ownership verification  
✅ **Input Validation**: Joi schemas with structured error responses  
✅ **Rate Limiting**: Global + auth-specific via express-rate-limit  
✅ **NoSQL Injection Prevention**: Custom sanitize middleware (Express 5 compatible)  
✅ **Security Headers**: Helmet (CSP, X-Frame-Options, etc.)  
✅ **CORS**: Configured with restricted origins  
✅ **Error Handling**: Secure responses without stack trace leakage  
✅ **Modern Stack**: ES Modules, Express 5, Mongoose 9, TypeScript 5

---

**Documentation Version**: 2.0  
**Last Updated**: February 17, 2026  
**Backend Version**: 1.0.0
