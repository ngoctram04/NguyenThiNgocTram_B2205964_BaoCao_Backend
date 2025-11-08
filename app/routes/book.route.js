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

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.use(authMiddleware);

router.get("/", getAllBooks);              
router.get("/:id", getBookById);           
router.post("/", upload.single("HinhAnh"), createBook);  
router.put("/:id", upload.single("HinhAnh"), updateBook);
router.delete("/:id", deleteBook);  

export default router;
