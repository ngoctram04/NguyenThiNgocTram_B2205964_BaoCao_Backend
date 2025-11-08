import express from "express";
import {
  getAllStaffs,
  createStaff,
  updateStaff,
  deleteStaff
} from "../controllers/staff.controller.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

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

export default router;
