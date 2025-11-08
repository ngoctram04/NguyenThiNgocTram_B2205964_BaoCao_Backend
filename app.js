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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method !== "GET") console.log("Body:", req.body);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/staffs", staffRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/borrows", borrowRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
