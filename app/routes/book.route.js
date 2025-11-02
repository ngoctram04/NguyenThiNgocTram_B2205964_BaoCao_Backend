import express from "express";
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "../controllers/book.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", upload.single("HinhAnh"), createBook);
router.put("/:id", upload.single("HinhAnh"), updateBook);
router.delete("/:id", deleteBook);

export default router;
