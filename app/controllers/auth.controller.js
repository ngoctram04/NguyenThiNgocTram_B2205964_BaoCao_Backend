import MongoDB from "../utils/mongodb.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";


export const login = async (req, res) => {
  try {
    const { MSNV, Password } = req.body;

    if (!MSNV || !Password) {
      return res.status(400).json({ message: "MSNV và Password là bắt buộc" });
    }

    const db = MongoDB.getDB();

    const staff = await db.collection("NhanVien").findOne({ MSNV });
    if (!staff) return res.status(404).json({ message: "Tài khoản không tồn tại" });

    const isMatch = await bcrypt.compare(Password, staff.Password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo token JWT
    const token = jwt.sign(
      { MSNV: staff.MSNV, Chucvu: staff.Chucvu.toLowerCase() },
      config.app.jwtSecret,
      { expiresIn: "8h" }
    );

    const { Password: _, ...userWithoutPassword } = staff;

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error("Login thất bại:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi server" });
  }
};

export const createDefaultAdmin = async () => {
  try {
    const db = MongoDB.getDB();

    const existingAdmin = await db.collection("NhanVien").findOne({ MSNV: "AD001" });

    if (existingAdmin) return; // Nếu admin mặc định đã tồn tại thì không tạo nữa

    const hashedPassword = await bcrypt.hash("admin123", 10); // mật khẩu mặc định

    await db.collection("NhanVien").insertOne({
      MSNV: "AD001",
      HoTenNV: "Admin",
      Password: hashedPassword,
      Chucvu: "admin",
      Diachi: "Địa chỉ admin",
      SoDienThoai: "0123456789",
      isDefaultAdmin: true,
    });

    console.log("Admin mặc định đã được tạo: MSNV=AD001, Password=admin123");
  } catch (err) {
    console.error("Tạo admin mặc định thất bại:", err);
  }
};
