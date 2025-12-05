import express from "express";
import { authUser } from "../middlewares/authUser.js";
import { authMiddleware, checkRole } from "../middlewares/auth.js";
import {
  createBorrow,
  getMyBorrow,
  getAllBorrow,
  approveBorrow,
  markReturned,
  rejectBorrow,
  deleteBorrow,
  calculateBorrowFine,
  statsBorrow
} from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/", authUser, createBorrow);
router.get("/my", authUser, getMyBorrow);
router.get("/:MaPhieu/fine", authUser, (req, res, next) => {
  if (!req.params?.MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });
  next();
}, calculateBorrowFine);

router.use(authMiddleware);

router.get("/", checkRole("admin", "staff"), getAllBorrow);
router.put("/:MaPhieu/approve", checkRole("admin", "staff"), (req, res, next) => {
  if (!req.params?.MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });
  next();
}, approveBorrow);

router.put("/:MaPhieu/returned", checkRole("admin", "staff"), (req, res, next) => {
  if (!req.params?.MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });
  next();
}, markReturned);

router.put("/:MaPhieu/reject", checkRole("admin", "staff"), (req, res, next) => {
  if (!req.params?.MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });
  next();
}, rejectBorrow);

router.delete("/:MaPhieu", checkRole("admin", "staff"), (req, res, next) => {
  if (!req.params?.MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });
  next();
}, deleteBorrow);

router.get("/stats", checkRole("admin", "staff"), statsBorrow);

export default router;
