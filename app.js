import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// --- Routes ---
import bookRoute from "./app/routes/book.route.js";
import readerRoute from "./app/routes/reader.route.js";
import categoryRoute from "./app/routes/category.route.js";
import staffRoute from "./app/routes/staff.route.js";
import borrowSlipRoute from "./app/routes/borrowSlip.route.js";
import publisherRoute from "./app/routes/publisher.route.js";
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API routes ---
app.use("/api/admin/books", bookRoute);
app.use("/api/admin/readers", readerRoute);
app.use("/api/admin/categories", categoryRoute);
app.use("/api/admin/staffs", staffRoute);
app.use("/api/admin/borrowSlips", borrowSlipRoute);
app.use("/api/admin/publishers", publisherRoute);
// --- Kiểm tra server ---
app.get("/", (req, res) => {
  res.send("Server backend đang chạy!");
});

export default app;
