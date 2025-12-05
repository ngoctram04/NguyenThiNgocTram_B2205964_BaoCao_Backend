import jwt from "jsonwebtoken";
import config from "../config/index.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "Không có token"
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Token không hợp lệ"
    });
  }
  try {
    const decoded = jwt.verify(token, config.app.jwtSecret);

    if (decoded.Chucvu) {
      decoded.Chucvu = decoded.Chucvu.toLowerCase();
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Token đã hết hạn"
      });
    }

    return res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Token không hợp lệ"
    });
  }
};

export const checkRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Chưa xác thực"
    });
  }

  const userRole = req.user.Chucvu?.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      code: "FORBIDDEN",
      message: "Không có quyền thực hiện hành động này"
    });
  }

  next();
};

export const adminOnly = checkRole("admin");

export const adminOrSelf = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Chưa xác thực"
    });
  }

  const userRole = req.user.Chucvu?.toLowerCase();
  const userId = req.user.MSNV;
  const paramId = req.params.id;

  if (userRole === "admin" || userId === paramId) {
    return next();
  }

  return res.status(403).json({
    code: "FORBIDDEN",
    message: "Không có quyền thực hiện hành động này"
  });
};
