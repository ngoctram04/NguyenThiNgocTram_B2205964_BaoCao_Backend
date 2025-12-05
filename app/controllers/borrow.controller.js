import borrowRepo from "../repositories/borrow.repository.js";
import bookRepo from "../repositories/book.repository.js";

const calculateFine = (NgayTraDuKien, NgayTraThucTe) => {
  if (!NgayTraDuKien || !NgayTraThucTe) return 0;

  const expected = new Date(NgayTraDuKien);
  expected.setHours(0, 0, 0, 0);

  const actual = new Date(NgayTraThucTe);
  actual.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((actual - expected) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays * 20000 : 0;
};

export const createBorrow = async (req, res) => {
  try {
    const MaDocGia = req.user?.MaDocGia;
    const { MaSach } = req.body;
    if (!MaSach) return res.status(400).json({ message: "Thiếu mã sách" });

    const book = await bookRepo.findById(MaSach);
    if (!book) return res.status(404).json({ message: "Sách không tồn tại" });
    if (book.SoQuyen <= 0) return res.status(400).json({ message: "Sách đã hết" });

    const NgayMuon = new Date();
    const NgayTraDuKien = new Date();
    NgayTraDuKien.setDate(NgayMuon.getDate() + 7);

    const MaPhieu = Date.now().toString();
    const data = {
      MaPhieu,
      MaDocGia,
      MaSach,
      NgayMuon,
      NgayTraDuKien,
      NgayTraThucTe: null,
      TrangThai: 1,
      NhanVienDuyet: null,
      TienPhat: 0,
    };

    const created = await borrowRepo.insert(data);
    res.status(201).json({ message: "Gửi yêu cầu mượn thành công", data: created });
  } catch (err) {
    console.error("createBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyBorrow = async (req, res) => {
  try {
    const MaDocGia = req.user?.MaDocGia;
    if (!MaDocGia) return res.status(400).json({ message: "Không xác định được độc giả" });

    const list = await borrowRepo.findByReader(MaDocGia);
    const myBorrows = await Promise.all(list.map(async (b) => {
      const book = await bookRepo.findById(b.MaSach);
      const TenSach = book?.TenSach || b.MaSach;
      const NhanVienDuyet = b.NhanVienDuyet || "-";

      let TienPhat = b.TienPhat || 0;
      if (b.TrangThai === 2) TienPhat = calculateFine(b.NgayTraDuKien, new Date());
      if (b.TrangThai === 3) TienPhat = b.TienPhat || 0;

      return { ...b, TenSach, NhanVienDuyet, TienPhat };
    }));

    res.json(myBorrows);
  } catch (err) {
    console.error("getMyBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllBorrow = async (req, res) => {
  try {
    const list = await borrowRepo.findAll();
    res.json(list);
  } catch (err) {
    console.error("getAllBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const approveBorrow = async (req, res) => {
  try {
    const MaPhieu = req.params?.MaPhieu;
    if (!MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });

    const NhanVienDuyet = req.user?.HoTen || req.user?.username || req.user?.MSNV;
    const borrow = await borrowRepo.findById(MaPhieu);
    if (!borrow) return res.status(404).json({ message: "Phiếu không tồn tại" });

    const book = await bookRepo.findById(borrow.MaSach);
    if (!book) return res.status(404).json({ message: "Sách không tồn tại" });
    if (book.SoQuyen <= 0) return res.status(400).json({ message: "Sách đã hết" });

    await bookRepo.update(book.MaSach, { SoQuyen: book.SoQuyen - 1 });
    await borrowRepo.update(MaPhieu, { TrangThai: 2, NhanVienDuyet });

    res.json({ message: "Duyệt phiếu thành công" });
  } catch (err) {
    console.error("approveBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const markReturned = async (req, res) => {
  try {
    const MaPhieu = req.params?.MaPhieu;
    if (!MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });

    const borrow = await borrowRepo.findById(MaPhieu);
    if (!borrow) return res.status(404).json({ message: "Phiếu không tồn tại" });

    const book = await bookRepo.findById(borrow.MaSach);
    if (!book) return res.status(404).json({ message: "Sách không tồn tại" });

    const NgayTraThucTe = new Date();
    const TienPhat = calculateFine(borrow.NgayTraDuKien, NgayTraThucTe);

    await bookRepo.update(book.MaSach, { SoQuyen: book.SoQuyen + 1 });
    await borrowRepo.update(MaPhieu, { TrangThai: 3, NgayTraThucTe, TienPhat });

    res.json({ message: "Đã đánh dấu trả sách", TienPhat });
  } catch (err) {
    console.error("markReturned error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const rejectBorrow = async (req, res) => {
  try {
    const MaPhieu = req.params?.MaPhieu;
    if (!MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });

    const borrow = await borrowRepo.findById(MaPhieu);
    if (!borrow) return res.status(404).json({ message: "Phiếu không tồn tại" });

    if (borrow.TrangThai === 2) {
      const book = await bookRepo.findById(borrow.MaSach);
      if (book) await bookRepo.update(book.MaSach, { SoQuyen: book.SoQuyen + 1 });
    }

    await borrowRepo.update(MaPhieu, { TrangThai: 4 });
    res.json({ message: "Đã từ chối / hủy phiếu" });
  } catch (err) {
    console.error("rejectBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteBorrow = async (req, res) => {
  try {
    const MaPhieu = req.params?.MaPhieu;
    if (!MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });

    const borrow = await borrowRepo.findById(MaPhieu);
    if (!borrow) return res.status(404).json({ message: "Phiếu không tồn tại" });

    if ([2,3].includes(borrow.TrangThai)) {
      const book = await bookRepo.findById(borrow.MaSach);
      if (book) await bookRepo.update(book.MaSach, { SoQuyen: book.SoQuyen + 1 });
    }

    await borrowRepo.delete(MaPhieu);
    res.json({ message: "Xóa phiếu mượn thành công" });
  } catch (err) {
    console.error("deleteBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const calculateBorrowFine = async (req, res) => {
  try {
    const MaPhieu = req.params?.MaPhieu;
    if (!MaPhieu) return res.status(400).json({ message: "Thiếu MaPhieu" });

    const borrow = await borrowRepo.findById(MaPhieu);
    if (!borrow) return res.status(404).json({ message: "Phiếu không tồn tại" });

    if (borrow.TrangThai !== 2) {
      return res.status(400).json({ message: "Phiếu chưa đang mượn, không thể tính phạt" });
    }

    const TienPhat = calculateFine(borrow.NgayTraDuKien, new Date());
    res.json({ MaPhieu, TienPhat });
  } catch (err) {
    console.error("calculateBorrowFine error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const statsBorrow = async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    if (!month || !year) return res.status(400).json({ message: "Thiếu month hoặc year" });

    const stats = await borrowRepo.statsByMonthYear(month, year);
    res.json(stats);
  } catch (err) {
    console.error("statsBorrow error:", err);
    res.status(500).json({ message: err.message });
  }
};
