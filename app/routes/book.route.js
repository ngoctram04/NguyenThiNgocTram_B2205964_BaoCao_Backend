import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../middlewares/auth.js";
import { 
  getAllBooks, 
  getBookById,  
  createBook, 
  updateBook, 
  deleteBook 
} from "../controllers/book.controller.js";

const router = express.Router();

// Tạo folder uploads nếu chưa tồn tại
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // đặt tên file là timestamp + extension
  },
});
const upload = multer({ storage });

// --- Routes ---
// Chỉ route GET hiển thị sách có thể để user không cần login nếu muốn
router.get("/", getAllBooks);              
router.get("/:id", getBookById);           

// Các route sau cần auth (thường admin mới được tạo, sửa, xóa)
router.use(authMiddleware);  

router.post("/", upload.single("HinhAnh"), createBook);  
router.put("/:id", upload.single("HinhAnh"), updateBook);
router.delete("/:id", deleteBook);  

export default router;
