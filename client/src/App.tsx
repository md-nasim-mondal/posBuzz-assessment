
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardLayout from './layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import POSPage from './pages/POS';
import ProductsPage from './pages/Products';
import RegisterPage from './pages/Register';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
           <Route index element={<Navigate to="/pos" replace />} />
           <Route path="pos" element={<POSPage />} />
           <Route path="products" element={<ProductsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
