import express from "express";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";
import { getAllBorrows, createBorrow, updateBorrow, deleteBorrow } from "../controllers/borrow.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", adminOnly, getAllBorrows);
router.post("/", adminOnly, createBorrow);
router.put("/:id", adminOnly, updateBorrow);
router.delete("/:id", adminOnly, deleteBorrow);

export default router;
