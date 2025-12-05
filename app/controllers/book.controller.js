import { ObjectId } from "mongodb";
import MongoDB from "../utils/mongodb.util.js";

const COLLECTION_NAME = "SACH";
const PUBLISHER_COLLECTION = "NXB";
const CATEGORY_COLLECTION = "THELOAI";

const isValidObjectId = (id) => ObjectId.isValid(id);

export const getAllBooks = async (req, res) => {
  try {
    const db = MongoDB.getDB();
    const { q } = req.query;

    const matchStage = {};
    if (q) {
      const regex = new RegExp(q.trim(), "i");
      matchStage.$or = [{ TenSach: regex }, { TacGia: regex }];
    }

    const books = await db.collection(COLLECTION_NAME).aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: PUBLISHER_COLLECTION,
          localField: "MaNXB",
          foreignField: "_id",
          as: "NXB"
        }
      },
      {
        $lookup: {
          from: CATEGORY_COLLECTION,
          localField: "MaTL",
          foreignField: "_id",
          as: "TheLoai"
        }
      },
      {
        $addFields: {
          TenNXB: { $arrayElemAt: ["$NXB.TenNXB", 0] },
          DiaChiNXB: { $arrayElemAt: ["$NXB.DiaChi", 0] },
          TenTL: { $arrayElemAt: ["$TheLoai.TenTL", 0] }
        }
      },
      { $project: { NXB: 0, TheLoai: 0 } }
    ]).toArray();

    const formatted = books.map(b => ({
      ...b,
      _id: b._id.toString(),
      MaSach: b.MaSach?.toString() || "",
      MaNXB: b.MaNXB?.toString() || "",
      MaTL: b.MaTL?.toString() || ""
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getAllBooks error:", err);
    res.status(500).json({ message: "Lỗi khi lấy sách", error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = MongoDB.getDB();

    const book = await db.collection(COLLECTION_NAME).aggregate([
      { $match: { MaSach: id } },
      {
        $lookup: {
          from: PUBLISHER_COLLECTION,
          localField: "MaNXB",
          foreignField: "_id",
          as: "NXB"
        }
      },
      {
        $lookup: {
          from: CATEGORY_COLLECTION,
          localField: "MaTL",
          foreignField: "_id",
          as: "TheLoai"
        }
      },
      {
        $addFields: {
          TenNXB: { $arrayElemAt: ["$NXB.TenNXB", 0] },
          DiaChiNXB: { $arrayElemAt: ["$NXB.DiaChi", 0] },
          TenTL: { $arrayElemAt: ["$TheLoai.TenTL", 0] }
        }
      },
      { $project: { NXB: 0, TheLoai: 0 } }
    ]).next();

    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });

    res.json({
      ...book,
      _id: book._id.toString(),
      MaSach: book.MaSach?.toString() || "",
      MaNXB: book.MaNXB?.toString() || "",
      MaTL: book.MaTL?.toString() || ""
    });
  } catch (err) {
    console.error("getBookById error:", err);
    res.status(500).json({ message: "Lỗi khi lấy sách", error: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const db = MongoDB.getDB();
    const { MaSach, TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia, MaTL } = req.body;

    if (!TenSach) return res.status(400).json({ message: "Tên sách là bắt buộc" });

    let finalMaSach = MaSach;
    if (!MaSach) {
      const allBooks = await db.collection(COLLECTION_NAME).find().toArray();
      const maxId = allBooks.reduce((max, b) => Math.max(max, parseInt(b.MaSach || "0", 10)), 0);
      finalMaSach = (maxId + 1).toString();
    }

    const exist = await db.collection(COLLECTION_NAME).findOne({ MaSach: finalMaSach });
    if (exist) return res.status(400).json({ message: "Mã sách đã tồn tại" });

    const HinhAnh = req.file ? `/uploads/${req.file.filename}` : "";

    const newBook = {
      MaSach: finalMaSach,
      TenSach,
      DonGia: DonGia ? Number(DonGia) : 0,
      SoQuyen: SoQuyen ? Number(SoQuyen) : 1,
      NamXuatBan: NamXuatBan || "",
      MaNXB: MaNXB || "",
      MaTL: MaTL || "",
      TacGia: TacGia || "",
      HinhAnh
    };

    await db.collection(COLLECTION_NAME).insertOne(newBook);
    res.status(201).json({ message: "Tạo sách thành công", data: newBook });
  } catch (err) {
    console.error("createBook error:", err);
    res.status(500).json({ message: "Lỗi khi tạo sách", error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const db = MongoDB.getDB();
    const updateData = { ...req.body };

    if (req.file) updateData.HinhAnh = `/uploads/${req.file.filename}`;
    if (updateData.DonGia) updateData.DonGia = Number(updateData.DonGia);
    if (updateData.SoQuyen) updateData.SoQuyen = Number(updateData.SoQuyen);

    const result = await db.collection(COLLECTION_NAME).updateOne({ MaSach: id }, { $set: updateData });
    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy sách" });

    const updatedBook = await db.collection(COLLECTION_NAME).findOne({ MaSach: id });

    res.json({
      message: "Cập nhật sách thành công",
      data: {
        ...updatedBook,
        _id: updatedBook._id.toString(),
        MaSach: updatedBook.MaSach?.toString() || ""
      }
    });
  } catch (err) {
    console.error("updateBook error:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật sách", error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const db = MongoDB.getDB();

    const result = await db.collection(COLLECTION_NAME).deleteOne({ MaSach: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy sách để xóa" });

    res.json({ message: "Xóa sách thành công" });
  } catch (err) {
    console.error("deleteBook error:", err);
    res.status(500).json({ message: "Lỗi khi xóa sách", error: err.message });
  }
};
