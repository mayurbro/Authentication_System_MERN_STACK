import express from "express";
import {
  forgetPassword,
  login,
  logout,
  signup,
  verifyEmail,
  checkAuth,
  resetPassword,
} from "../controller/auth_controller.js";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";

router.get("/check-auth", verifyToken, checkAuth);
router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
