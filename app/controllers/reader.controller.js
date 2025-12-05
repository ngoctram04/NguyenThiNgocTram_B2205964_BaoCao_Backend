import ReaderRepository from "../repositories/reader.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

export default {
  async getAll(req, res) {
    try {
      const readers = await ReaderRepository.findAll();
      const sanitized = readers.map(r => ({
        MaDocGia: r.MaDocGia,
        HoLot: r.HoLot,
        Ten: r.Ten,
        NgaySinh: r.NgaySinh,
        Phai: r.Phai,
        DiaCHi: r.DiaCHi,
        DienThoai: r.DienThoai,
        Email: r.Email
      }));
      res.json(sanitized);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi lấy danh sách độc giả" });
    }
  },

  async getById(req, res) {
    try {
      const reader = await ReaderRepository.findById(parseInt(req.params.id));
      if (!reader) return res.status(404).json({ message: "Độc giả không tồn tại" });

      const sanitized = {
        MaDocGia: reader.MaDocGia,
        HoLot: reader.HoLot,
        Ten: reader.Ten,
        NgaySinh: reader.NgaySinh,
        Phai: reader.Phai,
        DiaCHi: reader.DiaCHi,
        DienThoai: reader.DienThoai,
        Email: reader.Email
      };
      res.json(sanitized);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi lấy thông tin độc giả" });
    }
  },

  async create(req, res) {
    try {
      const newReader = {
        HoLot: req.body.HoLot,
        Ten: req.body.Ten,
        NgaySinh: req.body.NgaySinh,
        Phai: req.body.Phai,
        DiaCHi: req.body.DiaCHi,
        DienThoai: req.body.DienThoai,
        Email: req.body.Email,
        Password: req.body.Password
      };

      const inserted = await ReaderRepository.insert(newReader);

      res.status(201).json({
        message: "Thêm độc giả thành công",
        MaDocGia: inserted.MaDocGia,
        Email: newReader.Email
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi thêm độc giả" });
    }
  },

  async update(req, res) {
    try {
      const data = {
        HoLot: req.body.HoLot,
        Ten: req.body.Ten,
        NgaySinh: req.body.NgaySinh,
        Phai: req.body.Phai,
        DiaCHi: req.body.DiaCHi,
        DienThoai: req.body.DienThoai,
        Email: req.body.Email
      };
      if (req.body.Password) {
        data.Password = req.body.Password;
      }

      const result = await ReaderRepository.update(parseInt(req.params.id), data);
      if (result.modifiedCount === 0)
        return res.status(404).json({ message: "Độc giả không tồn tại hoặc không có thay đổi" });

      res.json({ message: "Cập nhật độc giả thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi cập nhật độc giả" });
    }
  },

  async delete(req, res) {
    try {
      const result = await ReaderRepository.delete(parseInt(req.params.id));
      if (result.deletedCount === 0)
        return res.status(404).json({ message: "Độc giả không tồn tại" });

      res.json({ message: "Xóa độc giả thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi xóa độc giả" });
    }
  },

  async register(req, res) {
    try {
      const { HoLot, Ten, NgaySinh, Phai, DiaCHi, DienThoai, Email, Password } = req.body;

      const existing = await ReaderRepository.findByEmail(Email);
      if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

      const newReader = { HoLot, Ten, NgaySinh, Phai, DiaCHi, DienThoai, Email, Password };
      const inserted = await ReaderRepository.insert(newReader);

      const token = jwt.sign(
        { MaDocGia: inserted.MaDocGia, Email, role: "reader" },
        config.app.jwtSecret,
        { expiresIn: "7d" }
      );

      const { Password: _, ...readerInfo } = { ...newReader, MaDocGia: inserted.MaDocGia };
      res.json({ token, reader: readerInfo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Đăng ký thất bại" });
    }
  },

  async login(req, res) {
    try {
      const email = req.body.email || req.body.Email;
      const password = req.body.password || req.body.Password;

      if (!email || !password)
        return res.status(400).json({ message: "Email hoặc mật khẩu không được để trống" });

      const user = await ReaderRepository.findByEmail(email);
      if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

      const match = await bcrypt.compare(password, user.Password);
      if (!match) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

      const token = jwt.sign(
        { MaDocGia: user.MaDocGia, Email: user.Email, role: "reader" },
        config.app.jwtSecret,
        { expiresIn: "7d" }
      );

      const { Password: _, ...readerInfo } = user;
      res.json({ token, reader: readerInfo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Login thất bại" });
    }
  }
};
