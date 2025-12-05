import express from "express";
import ReaderController from "../controllers/reader.controller.js";

const router = express.Router();

router.post("/register", ReaderController.register);
router.post("/login", ReaderController.login);

router.get("/", ReaderController.getAll);               // Lấy danh sách tất cả độc giả
router.get("/:id", ReaderController.getById);          // Lấy chi tiết theo MaDocGia
router.post("/", ReaderController.create);             // Thêm độc giả mới
router.put("/:id", ReaderController.update);           // Cập nhật độc giả
router.delete("/:id", ReaderController.delete);        // Xóa độc giả

export default router;
