import Staff from "../repositories/staff.repository.js";
import bcrypt from "bcryptjs";

// Lấy tất cả nhân viên
export async function getAll(req, res) {
  const staffs = await Staff.findAll();
  res.json(staffs);
}

// Lấy nhân viên theo MSNV
export async function getById(req, res) {
  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  res.json(staff);
}

// Thêm nhân viên mới
export async function create(req, res) {
  const { MSNV, HoTenNV, Password, Chucvu, Diachi, SoDienThoai } = req.body;

  // Hash password
  const hashed = await bcrypt.hash(Password, 10);

  const staff = {
    MSNV,
    HoTenNV,
    Password: hashed,
    Chucvu,
    Diachi,
    SoDienThoai,
  };

  const result = await Staff.insert(staff);
  res.json({ message: "Thêm nhân viên thành công", staff: result });
}

// Cập nhật nhân viên
export async function update(req, res) {
  const { Password, ...data } = req.body;
  if (Password) {
    data.Password = await bcrypt.hash(Password, 10);
  }

  await Staff.update(req.params.id, data);
  res.json({ message: "Cập nhật nhân viên thành công" });
}

// Xóa nhân viên
export async function deleteStaff(req, res) {
  await Staff.delete(req.params.id);
  res.json({ message: "Xóa nhân viên thành công" });
}

// Login
export async function login(req, res) {
  const { MSNV, Password } = req.body;

  const staff = await Staff.findById(MSNV);
  if (!staff) return res.status(404).json({ message: "Không tìm thấy nhân viên" });

  const isMatch = await bcrypt.compare(Password, staff.Password);
  if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng" });

  res.json({ message: "Đăng nhập thành công", staff });
}
