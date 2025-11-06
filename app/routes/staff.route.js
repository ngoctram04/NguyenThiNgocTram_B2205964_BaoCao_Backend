import express from "express";
import * as staffController from "../controllers/staff.controller.js";

const router = express.Router();

// Admin quản lý nhân viên
router.get("/", staffController.getAll);
router.get("/:id", staffController.getById);
router.post("/", staffController.create);
router.put("/:id", staffController.update);
router.delete("/:id", staffController.deleteStaff);

// Đăng nhập
router.post("/login", staffController.login);

export default router;
