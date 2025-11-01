import express from "express";
import cors from "cors";

// Routes
import bookRoute from "./app/routes/book.route.js";
import readerRoute from "./app/routes/reader.route.js";
import categoryRoute from "./app/routes/category.route.js";
import staffRoute from "./app/routes/staff.route.js";
import borrowSlipRoute from "./app/routes/borrowSlip.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/admin/books", bookRoute);
app.use("/api/admin/readers", readerRoute);
app.use("/api/admin/categories", categoryRoute);
app.use("/api/admin/staffs", staffRoute);
app.use("/api/admin/borrowSlips", borrowSlipRoute);

export default app;
