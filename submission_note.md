
# POSBuzz Submission Note

## Completed Features
- **Backend (NestJS)**:
  - **Prisma**: Updated to use `pg` connection pool and `@prisma/adapter-pg`.
  - **Authentication**:
    - Email/Password Registration with **Email Verification** (Brevo API).
    - Login with JWT (Blocked for unverified users).
    - **Forgot Password & Reset Password** flows.
  - **Email Service**: Transferred from Nodemailer to **Brevo API** for reliability.
  - **Products**: Complete CRUD operations.
  - **Sales**: Transactional sale creation with stock deduction validity checks.
- **Frontend (React + Vite)**:
  - **Routing**: Migrated to **React Router v7** Data API (Loaders/Actions).
  - **Responsive Layout**:
    - **Dashboard**: Fixed Sidebar (Desktop) / Drawer Navigation (Mobile).
    - **POS**: Stacked layout for mobile, optimized for <300px devices.
    - **Auth Pages**: Fluid responsiveness.
  - **Dashboard**: Dynamic User Profile (Name/Avatar/Logout).
  - **Product Management**: Data table with mobile scrolling support.
  - **POS System**: Visual product grid, Shopping Cart, and Checkout flow.
  - **State Management**: Zustand for Auth, TanStack Query for server state.
  - **Error Handling**: Custom 404 and Error pages.

## Tech Stack
- **Backend**: NestJS, Prisma (Adapter PG), PostgreSQL, Redis, Brevo API.
- **Frontend**: React, Vite, Ant Design, TanStack Query, Zustand, React Router v7.

## How to Run

### Backend
1. `cd server`
2. Ensure PostgreSQL and Redis are running.
3. Copy `.env.example` to `.env` and update credentials (DB, Redis, Brevo API).
4. `pnpm install`
5. `pnpm prisma migrate dev`
6. `pnpm start:dev`

### Frontend
1. `cd client`
2. Copy `.env.example` to `.env` and set `VITE_PUBLIC_BASE_API_URL`.
3. `pnpm install`
4. `pnpm dev`
5. Register a new account. Check email for verification link.

## Postman
A `postman_collection.json` is included in the root directory.
