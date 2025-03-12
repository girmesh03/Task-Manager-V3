import express from "express";
import {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getRefreshToken
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/refresh", getRefreshToken);

export default router;
