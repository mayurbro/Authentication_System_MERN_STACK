import "./App.css";
import FloatingShape from "./components/FloatingShape";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";

import { Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/resetPasswordPage.jsx";

const ProtectAuthRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};
// redirect authenticated and verified user to home page
// when user is authenticated it should not visit to the signup and login page again so we redirect them to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {
  const { authcheck, user, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    authcheck();
  }, [authcheck]);
  // protect routes that require authentication
  console.log("isCheking: " + isCheckingAuth);
  if (isCheckingAuth) return <LoadingSpinner />;
  console.log("isAuthenticated: " + isCheckingAuth);
  console.log(user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 vi-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />

      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />

      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Routes for sign up  and login */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectAuthRoute>
              <DashBoard />
            </ProtectAuthRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route path="/verify-email" element={<EmailVerificationPage />}></Route>
        <Route
          path="/forget-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        ></Route>
        <Route
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
          path="/reset-password/:token"
        />
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
