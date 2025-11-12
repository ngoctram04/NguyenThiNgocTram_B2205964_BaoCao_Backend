import express from "express";
import ReaderController from "../controllers/reader.controller.js";

const router = express.Router();

// CRUD độc giả (admin)
router.get("/", ReaderController.getAll);
router.get("/:id", ReaderController.getById);
router.post("/", ReaderController.create);
router.put("/:id", ReaderController.update);
router.delete("/:id", ReaderController.delete);

export default router;
