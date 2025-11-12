import express from "express";
import {
  getAllStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffCount, // <-- import controller mới
} from "../controllers/staff.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Áp dụng auth cho tất cả routes
router.use(authMiddleware);

// --- Admin chỉ
router.get("/", adminOnly, getAllStaffs);
router.post("/", adminOnly, createStaff);
router.put("/:id", adminOnly, updateStaff);
router.delete("/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  if (id === "AD001") {
    return res.status(403).json({ message: "Không được xóa admin mặc định" });
  }
  await deleteStaff(req, res);
});

// --- Route mới: tổng số nhân viên, admin + staff đều xem được
router.get("/count", async (req, res) => {
  await getStaffCount(req, res);
});

export default router;
