import jwt from "jsonwebtoken";
import config from "../config/index.js";

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

    req.user = decoded;
    next();
  } catch (err) {
    console.error("AuthUser Middleware Error:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

export const readerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const role = req.user.role?.toLowerCase();
  if (role !== "reader") {
    return res.status(403).json({ message: "Chỉ độc giả mới được thực hiện" });
  }

  next();
};

export const adminOrSelf = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const role = req.user.role?.toLowerCase();
  const userId = req.user.MaDocGia?.toString();
  const paramId = req.params.id?.toString();

  if (role === "admin" || userId === paramId) {
    return next();
  }

  return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
};
