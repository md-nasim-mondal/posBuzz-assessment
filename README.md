
# POSBuzz - Store Management System

POSBuzz is a modern, full-stack Point of Sale (POS) application built to demonstrate a scalable, modular, and production-ready architecture. It features secure authentication (including email verification), product management, and a transactional sales system.

## 🚀 Deployment Links

- **Frontend (Live)**: [https://posbuzz-assessment-client.vercel.app](https://posbuzz-assessment-client.vercel.app)
- **Backend (API)**: [https://posbuzz-assessment-server.onrender.com](https://posbuzz-assessment-server.onrender.com)

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS (Modular Architecture)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma (using `@prisma/adapter-pg` and `pg` connection pool)
- **Caching**: Redis
- **Email**: Brevo API (Transactional Emails)
- **Auth**: Passport-JWT, Bcrypt

### Frontend
- **Framework**: React + Vite
- **Routing**: React Router v7 (Data Routing)
- **UI Component Library**: Ant Design
- **State Management**: Zustand (Auth Store), TanStack Query (Server State)
- **Styling**: TailwindCSS (Utility) + AntD Token System

## 📂 Project Structure

```
posBuzz-assessment/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/          # Application Pages
│   │   ├── components/     # Reusable Components
│   │   ├── layout/         # Layouts (Dashboard, etc.)
│   │   ├── routes/         # React Router v7 Configuration
│   │   ├── lib/            # Utility libraries
│   │   └── store/          # Global State
│   └── ...
├── server/                 # NestJS Backend
│   ├── prisma/             # Schema & Migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/    # Feature Modules
│   │   │   └── shared/     # Shared Modules (Email, Prisma)
│   │   └── ...
│   └── ...
├── postman_collection.json # API Documentation
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis
- pnpm (recommended)

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure Environment Variables:
    - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    - Update the variables (Database, Redis, Brevo API Key):
    ```env
    DATABASE_URL="..."
    DIRECT_URL="..."
    BREVO_API_KEY="..."
    FRONTEND_URL="http://localhost:5173"
    ```
4.  Run Database Migrations:
    ```bash
    pnpm prisma migrate dev
    ```
5.  Start the Server:
    ```bash
    pnpm start:dev
    ```
    The server will run on `http://localhost:3000`.

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure Environment Variables:
    - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    - Set the Backend URL:
    ```env
    VITE_PUBLIC_BASE_API_URL="http://localhost:3000"
    ```
4.  Start the Development Server:
    ```bash
    pnpm dev
    ```
    The app will run on `http://localhost:5173`.

## 🧪 Testing

### API Testing (Postman)
Import the `postman_collection.json` file (located in the root directory) into Postman to test all API endpoints, including:
- **Auth**: Register (with email verification), Login, Forgot/Reset Password.
- **Products**: CRUD operations.
- **Sales**: Create sales transactions.

### Login Credentials (Seeded)
If you seeded the DB:
- **Email**: `admin@posbuzz.com`
- **Password**: `admin123`

## ✨ Features
- **Secure Auth**: JWT-based auth with email verification loop.
- **Robust Role**: Admin/User role support.
- **Real-time Stock**: Transactional sales ensure stock is never oversold.
- **Responsive POS**: Mobile-first design managed via React Router v7.
- **Data Tables**: Managed product inventory with searching and sorting.
- **User Profile**: Dynamic dashboard with user details.
