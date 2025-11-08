import express from "express";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập nhân viên hoặc admin
 * @access  Public
 */
router.post("/login", login);

export default router;
