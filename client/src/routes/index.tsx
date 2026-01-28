import { createBrowserRouter, redirect } from "react-router";
import DashboardLayout from "../layout/DashboardLayout";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import VerifyEmailPage from "../pages/VerifyEmail";
import ForgotPasswordPage from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import POSPage from "../pages/POS";
import ProductsPage from "../pages/Products";
import { useAuthStore } from "../store/useAuthStore";

const protectedLoader = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return redirect("/login");
  }
  return null;
};

import NotFoundPage from "../pages/NotFound";
import ErrorPage from "../pages/ErrorPage";

// ... existing imports

const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    loader: protectedLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: () => redirect("/pos"),
      },
      {
        path: "pos",
        Component: POSPage,
      },
      {
        path: "products",
        Component: ProductsPage,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/verify-email",
    Component: VerifyEmailPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/reset-password",
    Component: ResetPasswordPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  }
]);

export default router;