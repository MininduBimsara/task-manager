
---

### **PLAN.md - Task Management System (Updated)**

#### **1. Backend Choice Justification**

* **Choice:** **Express.js** (for backend)
* **Justification:**

  * **Simplicity:** Express.js provides a lightweight, minimal framework for building RESTful APIs.
  * **MongoDB Integration:** Works seamlessly with MongoDB using **Mongoose** for handling tasks and user data.
  * **JWT & cookie management:** Express simplifies handling JWT authentication and cookies.
  * **Security:** Offers great flexibility in applying middleware (e.g., helmet for headers, rate limiting, and input validation).

#### **2. High-Level Architecture Overview**

* **Frontend:**

  * Built using **Next.js** for efficient SSR and routing.
  * Pages:

    * **Login Page** for user authentication.
    * **Register Page** for new users.
    * **Dashboard Page** to display tasks, including CRUD operations.
    * **Task Form** to create/edit tasks.
    * **Route Protection** to secure access to tasks and dashboard.
    * **Error/Loading states** for better user experience.
* **Backend:**

  * **Express.js API** for authentication and task management.
  * **JWT Authentication:** Tokens are stored in **HttpOnly cookies** to prevent XSS attacks.
  * **MongoDB** to store user and task data.
  * **Security Considerations:**

    * **Password Hashing** using bcrypt.
    * **JWT Authentication** with secure cookies.
    * **Rate Limiting** to prevent brute-force attacks.
    * **Input Validation** with libraries like Joi or Zod.
    * **Error Handling** to prevent stack trace leakage.

#### **3. Security Considerations**

* **Client-Side Security:**

  * **XSS Prevention:** Always sanitize and escape input and output.
  * **CSRF Protection:** Use **SameSite cookies** and optionally implement a CSRF token for additional protection.
  * **Token Storage:** Store JWT tokens in **HttpOnly cookies** to minimize XSS risks.
  * **CSP (Content Security Policy):** Implement basic CSP for added security.
* **Server-Side Security:**

  * **Password Hashing:** Use bcrypt to hash passwords before storing them.
  * **Rate Limiting:** Apply rate limits on login and registration endpoints.
  * **Input Validation:** Use validation libraries (like Joi or Zod) to sanitize and validate user input.
  * **JWT Validation:** Ensure the JWT is validated on protected routes.
  * **Error Handling:** Use generic error responses (no stack traces) to avoid leaking information.

#### **4. Proposed Backend Endpoints**

* **Auth Endpoints:**

  * `POST /auth/register`: User registration (password hashed).
  * `POST /auth/login`: User login (JWT token generation).
  * `POST /auth/refresh`: Token refresh endpoint (for JWT-based authentication).
* **Task Endpoints:**

  * `GET /tasks`: Fetch tasks for the authenticated user.
  * `POST /tasks`: Create a new task (linked to the logged-in user).
  * `PUT /tasks/:id`: Update an existing task (ensure task ownership).
  * `DELETE /tasks/:id`: Delete a task (ensure task ownership).

#### **5. Database - MongoDB Design (Updated)**

* **User Model:**

  * Fields: `id`, `email`, `password`, `createdAt`
  * **Password** will be stored directly as a hashed string (no need for `passwordHash`).
  * **Indexing:** Index `email` field for fast lookups (e.g., for login validation).

  Example:

  ```javascript
  const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  ```

* **Task Model:**

  * Fields: `id`, `userId`, `title`, `description`, `status`, `createdAt`, `updatedAt`
  * **Indexing:** Index `userId` for faster retrieval of tasks belonging to a specific user.

  Example:

  ```javascript
  const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  ```

#### **6. Frontend - Next.js Implementation (Updated)**

* **State Management with Redux:** Use **Redux** to manage the state, especially for user authentication and task data.

  * Create actions like `setUser`, `setTasks`, `setLoading`, and `setError` for handling app-wide state.
  * Use Redux Thunk or Redux Toolkit for async logic (e.g., fetching tasks, submitting tasks).
* **Pages:**

  * **Login Page:** Sends login credentials to `/auth/login`, stores the JWT in HttpOnly cookies, and redirects to the dashboard.
  * **Register Page:** Allows users to create an account and posts to `/auth/register`.
  * **Dashboard Page:** Displays the list of tasks. If the user is not authenticated, they are redirected to the login page.
  * **Task Form:** Allows users to create or edit tasks with validation feedback.
* **Route Protection:** Check for the presence of a valid JWT in the cookies before rendering protected pages (dashboard, task form).

#### **7. Optional Novelty Feature**

You can add the following:

* **Task Prioritization:** Add a priority field to tasks (e.g., "High", "Medium", "Low").
* **Search and Filtering:** Implement search and filtering for tasks by status or title.
* **Task Reminders:** Add due date reminders to tasks, sending a notification when tasks are due.

#### **8. Deployment Strategy**

* **Frontend (Next.js)** will be deployed on **Vercel**.
* **Backend (Express.js)** will be deployed on **Render** or **Railway** for easy scaling.
* **MongoDB** will be hosted on **MongoDB Atlas** for a fully managed solution.

#### **9. Commit Strategy**

* **Clear Commit History:**

  * Break down commits to show incremental development steps.
  * Examples:

    * `feat: Implement user registration endpoint`
    * `feat: Add JWT login and token handling`
    * `feat: Implement task CRUD functionality`
    * `fix: Resolve task form validation issues`
    * `docs: Update README with deployment steps`

---

