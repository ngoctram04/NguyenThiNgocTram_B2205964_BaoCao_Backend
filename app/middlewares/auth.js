import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Không có token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const decoded = jwt.verify(token, config.app.jwtSecret);

    if (decoded.Chucvu) decoded.Chucvu = decoded.Chucvu.toLowerCase();

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

export const checkRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const userRole = req.user.Chucvu?.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
  }

  next();
};

export const adminOnly = checkRole("admin");

export const adminOrSelf = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Chưa xác thực" });

  const userRole = req.user.Chucvu?.toLowerCase();
  const userId = req.user.MSNV;
  const paramId = req.params.id;

  if (userRole === "admin" || userId === paramId) {
    return next();
  }

  return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
};
