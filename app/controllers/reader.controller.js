import ReaderRepository from "../repositories/reader.repository.js";

export default {
  // --- Lấy toàn bộ độc giả
  async getAll(req, res) {
    try {
      const readers = await ReaderRepository.findAll();
      // Nếu muốn, có thể lọc bớt trường nhạy cảm
      const sanitized = readers.map(r => ({
        MaDocGia: r.MaDocGia,
        HoLot: r.HoLot,
        Ten: r.Ten,
        NgaySinh: r.NgaySinh,
        Phai: r.Phai,
        DiaChi: r.DiaChi,
        DienThoai: r.DienThoai
      }));
      res.json(sanitized);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi lấy danh sách độc giả" });
    }
  },

  // --- Lấy chi tiết độc giả theo ID
  async getById(req, res) {
    try {
      const reader = await ReaderRepository.findById(req.params.id);
      if (!reader) return res.status(404).json({ message: "Độc giả không tồn tại" });

      const sanitized = {
        MaDocGia: reader.MaDocGia,
        HoLot: reader.HoLot,
        Ten: reader.Ten,
        NgaySinh: reader.NgaySinh,
        Phai: reader.Phai,
        DiaChi: reader.DiaChi,
        DienThoai: reader.DienThoai
      };

      res.json(sanitized);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi lấy thông tin độc giả" });
    }
  },

  // --- Thêm độc giả (dành cho admin, giữ lại)
  async create(req, res) {
    try {
      const newReader = {
        MaDocGia: req.body.MaDocGia,
        HoLot: req.body.HoLot,
        Ten: req.body.Ten,
        NgaySinh: req.body.NgaySinh,
        Phai: req.body.Phai,
        DiaChi: req.body.DiaChi,
        DienThoai: req.body.DienThoai
      };
      await ReaderRepository.insert(newReader);
      res.status(201).json({ message: "Thêm độc giả thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi thêm độc giả" });
    }
  },

  // --- Cập nhật độc giả (dành cho admin, giữ lại)
  async update(req, res) {
    try {
      const data = {
        HoLot: req.body.HoLot,
        Ten: req.body.Ten,
        NgaySinh: req.body.NgaySinh,
        Phai: req.body.Phai,
        DiaChi: req.body.DiaChi,
        DienThoai: req.body.DienThoai
      };
      const result = await ReaderRepository.update(req.params.id, data);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Độc giả không tồn tại hoặc không có thay đổi" });
      }
      res.json({ message: "Cập nhật độc giả thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi cập nhật độc giả" });
    }
  },

  // --- Xóa độc giả (dành cho admin, giữ lại)
  async delete(req, res) {
    try {
      const result = await ReaderRepository.delete(req.params.id);
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Độc giả không tồn tại" });
      }
      res.json({ message: "Xóa độc giả thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server khi xóa độc giả" });
    }
  }
};
