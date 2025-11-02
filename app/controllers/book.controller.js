import { ObjectId } from "mongodb";
import bookRepo from "../repositories/book.repository.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await bookRepo.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách", error });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await bookRepo.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sách", error });
  }
};

export const createBook = async (req, res) => {
  try {
    const { TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia } = req.body;

    if (!TenSach || !DonGia || !SoQuyen)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

    if (!req.file)
      return res.status(400).json({ message: "Hình ảnh là bắt buộc!" });

    const book = {
      MaSach: new ObjectId().toString(),
      TenSach,
      DonGia: Number(DonGia),
      SoQuyen: Number(SoQuyen),
      NamXuatBan,
      MaNXB,
      TacGia,
      HinhAnh: `/uploads/${req.file.filename}`,
    };

    const insertedBook = await bookRepo.insert(book);
    res.status(201).json({ message: "Thêm sách thành công!", book: insertedBook });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm sách", error });
  }
};

export const updateBook = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.HinhAnh = `/uploads/${req.file.filename}`;
    }

    const result = await bookRepo.update(req.params.id, data);

    if (!result.matchedCount)
      return res.status(404).json({ message: "Không tìm thấy sách để cập nhật" });

    res.status(200).json({ message: "Cập nhật sách thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật sách", error });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await bookRepo.delete(req.params.id);

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy sách để xóa" });

    res.status(200).json({ message: "Xóa sách thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sách", error });
  }
};
