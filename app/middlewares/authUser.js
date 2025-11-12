// src/app/middlewares/authUser.js
import jwt from "jsonwebtoken";
import config from "../config/index.js";

// Middleware bắt buộc login user (độc giả)
export const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const decoded = jwt.verify(token, config.app.jwtSecret);

    req.user = decoded; // { MaDocGia, username, role: "reader", ... }
    next();
  } catch (err) {
    console.error("AuthUser Middleware Error:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

// Kiểm tra role độc giả
export const readerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const role = req.user.role?.toLowerCase();
  if (role !== "reader") {
    return res.status(403).json({ message: "Chỉ độc giả mới được thực hiện" });
  }

  next();
};

// Admin hoặc chính user (nếu muốn route như chỉnh sửa profile)
export const adminOrSelf = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const role = req.user.role?.toLowerCase();
  const userId = req.user.MaDocGia;
  const paramId = req.params.id;

  if (role === "admin" || userId === paramId) {
    return next();
  }

  return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
};
