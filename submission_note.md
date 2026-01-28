
# POSBuzz Submission Note

## Completed Features
- **Backend (NestJS)**:
  - **Prisma**: Updated to use `pg` connection pool and `@prisma/adapter-pg`.
  - **Authentication**:
    - Email/Password Registration with **Email Verification**.
    - Login with JWT.
    - **Forgot Password & Reset Password** flows.
  - **Email Service**: Uses `nodemailer` (Gmail/SMTP).
  - **Products**: Complete CRUD operations.
  - **Sales**: Transactional sale creation with stock deduction validity checks.
- **Frontend (React + Vite)**:
  - **Auth Pages**: Login, Register, Verify Email, Forgot Password, Reset Password.
  - **Dashboard**: Layout with sidebar navigation.
  - **Product Management**: Data table with "Add Product" and "Delete" functionality.
  - **POS System**: Visual product grid, Shopping Cart, and Checkout flow.
  - **State Management**: Zustand for Auth, React Query for server state.

## Tech Stack
- **Backend**: NestJS, Prisma (Adapter PG), PostgreSQL, Redis (Local), Nodemailer.
- **Frontend**: React, Vite, Ant Design, TanStack Query, Zustand.

## How to Run

### Backend
1. `cd server`
2. Ensure PostgreSQL and Redis are running.
3. Update `.env` with your DB credentials And **EMAIL_USER**, **EMAIL_PASS** (App Password).
4. `pnpm install`
5. `pnpm prisma migrate dev`
6. `pnpm start:dev`

### Frontend
1. `cd client`
2. `pnpm install`
3. `pnpm dev`
4. Register a new account. Check email (or console logs if configured) for verification link.

## Postman
A `postman_collection.json` is included in the root directory.
