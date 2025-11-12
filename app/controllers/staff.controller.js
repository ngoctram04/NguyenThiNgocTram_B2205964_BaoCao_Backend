import MongoDB from "../utils/mongodb.util.js";
import bcrypt from "bcryptjs";

export const getAllStaffs = async (req, res) => {
  try {
    const db = MongoDB.getDB();
    const staffs = await db.collection("NhanVien").find().toArray();

    const formattedStaffs = staffs.map(({ Password, ...rest }) => ({
      ...rest,
      _id: rest._id.toString(),
    }));

    res.json(formattedStaffs);
  } catch (err) {
    console.error("Get all staffs error:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách nhân viên" });
  }
};


export const createStaff = async (req, res) => {
  try {
    const { MSNV, HoTenNV, Password, Chucvu, Diachi, SoDienThoai } = req.body;

    if (!MSNV || !HoTenNV || !Password || !Chucvu) {
      return res.status(400).json({ message: "MSNV, HoTenNV, Password và Chucvu là bắt buộc" });
    }

    const db = MongoDB.getDB();

    const existing = await db.collection("NhanVien").findOne({ MSNV });
    if (existing) {
      return res.status(400).json({ message: `Mã nhân viên ${MSNV} đã tồn tại` });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await db.collection("NhanVien").insertOne({
      MSNV,
      HoTenNV,
      Password: hashedPassword,
      Chucvu: Chucvu.toLowerCase(),
      Diachi: Diachi || "",
      SoDienThoai: SoDienThoai || "",
      isDefaultAdmin: false,
    });

    res.status(201).json({ message: "Tạo nhân viên thành công" });
  } catch (err) {
    console.error("Create staff error:", err);
    res.status(500).json({ message: "Lỗi server khi tạo nhân viên" });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { HoTenNV, Password, Chucvu, Diachi, SoDienThoai } = req.body;
    const db = MongoDB.getDB();

    if (id === "AD001" && Chucvu && Chucvu.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Không thể đổi role admin mặc định" });
    }

    const updateData = {};
    if (HoTenNV) updateData.HoTenNV = HoTenNV;
    if (Chucvu) updateData.Chucvu = Chucvu.toLowerCase();
    if (Diachi) updateData.Diachi = Diachi;
    if (SoDienThoai) updateData.SoDienThoai = SoDienThoai;
    if (Password) updateData.Password = await bcrypt.hash(Password, 10);

    const result = await db.collection("NhanVien").updateOne({ MSNV: id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: `Không tìm thấy nhân viên ${id}` });
    }

    res.json({ message: "Cập nhật nhân viên thành công" });
  } catch (err) {
    console.error("Update staff error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật nhân viên" });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "AD001") {
      return res.status(403).json({ message: "Không thể xóa admin mặc định" });
    }

    const db = MongoDB.getDB();
    const result = await db.collection("NhanVien").deleteOne({ MSNV: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `Không tìm thấy nhân viên ${id} để xóa` });
    }

    res.json({ message: "Xóa nhân viên thành công" });
  } catch (err) {
    console.error("Delete staff error:", err);
    res.status(500).json({ message: "Lỗi server khi xóa nhân viên" });
  }
};
export const getStaffCount = async (req, res) => {
  try {
    const db = MongoDB.getDB();
    const count = await db.collection("NhanVien").countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Get staff count error:", err);
    res.status(500).json({ message: "Lỗi server khi lấy tổng số nhân viên" });
  }
};