import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./app/routes/auth.route.js";
import staffRoutes from "./app/routes/staff.route.js";
import bookRoutes from "./app/routes/book.route.js";
import publisherRoutes from "./app/routes/publisher.route.js";
import readerRoutes from "./app/routes/reader.route.js";
import borrowRoutes from "./app/routes/borrow.route.js";

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (ảnh upload)
app.use("/uploads", express.static(path.resolve("uploads")));

// Logger đơn giản
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method !== "GET") console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);          // Đăng ký/Đăng nhập user/admin
app.use("/api/staffs", staffRoutes);      // Quản lý nhân viên (admin)
app.use("/api/books", bookRoutes);        // Quản lý sách
app.use("/api/publishers", publisherRoutes); // Quản lý NXB
app.use("/api/readers", readerRoutes);    // Quản lý độc giả
app.use("/api/borrows", borrowRoutes);    // Quản lý mượn/trả sách

// Route test gốc
app.get("/", (req, res) => {
  res.send("📚 Library Management API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
