
# POSBuzz - Store Management System

POSBuzz is a modern, full-stack Point of Sale (POS) application built to demonstrate a scalable, modular, and production-ready architecture. It features secure authentication (including email verification), product management, and a transactional sales system.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS (Modular Architecture)
- **Database**: PostgreSQL
- **ORM**: Prisma (using `@prisma/adapter-pg` and `pg` connection pool)
- **Caching**: Redis
- **Email**: Nodemailer (SMTP)
- **Auth**: Passport-JWT, Bcrypt

### Frontend
- **Framework**: React + Vite
- **UI Component Library**: Ant Design
- **State Management**: Zustand (Auth Store), TanStack Query (Server State)
- **Styling**: TailwindCSS (Utility) + AntD Token System

## 🚀 Deployment

- **Frontend**: [posbuzz-assessment-client.vercel.app](https://posbuzz-assessment-client.vercel.app)
- **Backend**: [posbuzz-assessment-server.onrender.com](https://posbuzz-assessment-server.onrender.com)

## 📂 Project Structure

```
posBuzz-assessment/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/          # Application Pages (POS, Products, Auth)
│   │   ├── components/     # Reusable Components
│   │   ├── lib/            # Utility libraries (Axios, QueryClient)
│   │   └── store/          # Global State (Zustand)
│   └── ...
├── server/                 # NestJS Backend
│   ├── prisma/             # Schema & Migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/    # Feature Modules (Auth, Users, Products, Sales)
│   │   │   └── shared/     # Shared Modules (Prisma, Email)
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
    - Create a `.env` file in `server/` (copy `.env.example` if available, or use the template below):
    ```env
    DATABASE_URL="postgresql://user:password@hostname:port/db?schema=public"
    DIRECT_URL="postgresql://user:password@hostname:port/db"
    JWT_SECRET="your-super-secret-key"
    BREVO_API_KEY="your-brevo-key"
    BREVO_FROM_EMAIL="sender@example.com"
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
    The server will run on `http://localhost:3000`. It will automatically seed an Admin user if one does not exist.

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Start the Development Server:
    ```bash
    pnpm dev
    ```
    The app will run on `http://localhost:5173`.

## 🧪 Testing

### API Testing (Postman)
Import the `postman_collection.json` file (located in the root directory) into Postman to test all API endpoints, including:
- **Auth**: Register (with email verify), Login, Forgot/Reset Password.
- **Products**: CRUD operations.
- **Sales**: Create sales transactions.

### Login Credentials
The system automatically seeds a default Admin user on startup if missing:
- **Email**: `admin@posbuzz.com`
- **Password**: `123456`

## ✨ Features
- **Secure Auth**: JWT-based auth with email verification loop.
- **Real-time Stock**: Transactional sales ensure stock is never oversold.
- **Responsive POS**: Clean, grid-based POS interface for quick sales.
- **Data Tables**: Managed product inventory with searching and sorting.
