# Task Manager

A full-stack Task Management System built with **Next.js** (frontend) and **Express.js** (backend), featuring JWT authentication with HttpOnly cookies, task CRUD operations, and a dark-themed UI.

## Tech Stack

| Layer    | Technology                                                               |
| -------- | ------------------------------------------------------------------------ |
| Frontend | Next.js 16, React 19, Redux Toolkit, TypeScript, TailwindCSS 4           |
| Backend  | Express.js 5, TypeScript, Mongoose 9                                     |
| Database | MongoDB (Atlas)                                                          |
| Auth     | JWT (access + refresh tokens) in HttpOnly cookies                        |
| Security | Helmet, bcryptjs, express-rate-limit, Joi validation, NoSQL sanitization |

## Project Structure

```
task-manager/
├── backend/                # Express.js API
│   ├── src/
│   │   ├── config/         # DB connection, env setup
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── middleware/      # Auth, validation, rate limiting, sanitize
│   │   ├── models/         # Mongoose schemas (User, Task)
│   │   ├── repositories/   # Database operations
│   │   ├── routes/         # Route definitions
│   │   ├── services/       # Business logic
│   │   ├── validators/     # Joi validation schemas
│   │   └── server.ts       # Entry point
│   └── package.json
├── frontend/               # Next.js app
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   └── package.json
├── PLAN.md                 # Phase 1 planning document
└── README.md               # This file
```

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/MininduBimsara/task-manager.git
cd task-manager
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/task-manager   # or your Atlas URI
JWT_SECRET=your_secure_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm start        # production
npm run dev      # development (auto-restart with nodemon)
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

## API Endpoints

### Authentication

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| POST   | `/auth/register` | Register a new user      | No            |
| POST   | `/auth/login`    | Login and receive tokens | No            |
| POST   | `/auth/refresh`  | Refresh access token     | No            |
| POST   | `/auth/logout`   | Logout and clear tokens  | Yes           |

### Tasks

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| GET    | `/api/tasks`     | Get all tasks (own only) | Yes           |
| GET    | `/api/tasks/:id` | Get a specific task      | Yes           |
| POST   | `/api/tasks`     | Create a new task        | Yes           |
| PUT    | `/api/tasks/:id` | Update an existing task  | Yes           |
| DELETE | `/api/tasks/:id` | Delete a task            | Yes           |

## Security Features

- **Password hashing** — bcryptjs with 10 salt rounds
- **JWT authentication** — Short-lived access tokens (15 min) + refresh token rotation (7 days)
- **HttpOnly cookies** — Tokens stored in HttpOnly, Secure, SameSite=strict cookies
- **Rate limiting** — 100 req/15min global, 10 req/15min on auth endpoints
- **Input validation** — Joi schemas on all inputs with `stripUnknown`
- **NoSQL injection prevention** — Custom sanitize middleware strips `$` and `.` keys
- **HTTP security headers** — Helmet (CSP, X-Frame-Options, HSTS, etc.)
- **CORS** — Restricted to frontend origin only
- **Secure error handling** — No stack traces leaked in responses

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                 | Example                                  |
| -------------- | --------------------------- | ---------------------------------------- |
| `PORT`         | Server port                 | `5000`                                   |
| `NODE_ENV`     | Environment                 | `development` / `production`             |
| `MONGO_URI`    | MongoDB connection string   | `mongodb://localhost:27017/task-manager` |
| `JWT_SECRET`   | Secret key for signing JWTs | (any secure random string)               |
| `FRONTEND_URL` | Allowed CORS origin         | `http://localhost:3000`                  |

### Frontend (`frontend/.env.local`)

| Variable              | Description          | Example                 |
| --------------------- | -------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |
