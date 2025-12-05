import MongoDB from "../utils/mongodb.util.js";

const COLLECTION_NAME = "SACH";

export default {
  async findAll() {
    try {
      const db = MongoDB.getDB();
      const books = await db.collection(COLLECTION_NAME).aggregate([
        {
          $lookup: {
            from: "THELOAI",
            localField: "MaTL",
            foreignField: "MaTL",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      ]).toArray();

      return books.map(b => ({
        ...b,
        _id: b._id.toString(),
        TenTL: b.category?.TenTL || null,
        category: undefined
      }));
    } catch (err) {
      console.error("findAll error:", err);
      throw new Error("Lỗi khi lấy danh sách sách: " + err.message);
    }
  },

  async findById(MaSach) {
    try {
      const db = MongoDB.getDB();
      const books = await db.collection(COLLECTION_NAME).aggregate([
        { $match: { MaSach: MaSach.toString() } },
        {
          $lookup: {
            from: "THELOAI",
            localField: "MaTL",
            foreignField: "MaTL",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      ]).toArray();

      const book = books[0];
      if (!book) return null;

      return {
        ...book,
        _id: book._id.toString(),
        TenTL: book.category?.TenTL || null,
        category: undefined
      };
    } catch (err) {
      console.error("findById error:", err);
      throw new Error("Lỗi khi tìm sách: " + err.message);
    }
  },

  async insert(book) {
    try {
      const db = MongoDB.getDB();
      if (book.MaSach != null) book.MaSach = book.MaSach.toString();
      if (book.MaTL) book.MaTL = book.MaTL.toString();

      const result = await db.collection(COLLECTION_NAME).insertOne(book);
      return { _id: result.insertedId.toString(), ...book };
    } catch (err) {
      console.error("insert error:", err);
      throw new Error("Lỗi khi tạo sách: " + err.message);
    }
  },

  async update(MaSach, data) {
    try {
      const db = MongoDB.getDB();
      if (MaSach != null) MaSach = MaSach.toString();
      if (data.MaTL) data.MaTL = data.MaTL.toString();

      const result = await db.collection(COLLECTION_NAME).updateOne(
        { MaSach },
        { $set: data }
      );
      if (result.matchedCount === 0) {
        throw new Error("Không tìm thấy sách để cập nhật");
      }
      return result;
    } catch (err) {
      console.error("update error:", err);
      throw new Error("Lỗi khi cập nhật sách: " + err.message);
    }
  },

  async delete(MaSach) {
    try {
      const db = MongoDB.getDB();
      if (MaSach != null) MaSach = MaSach.toString();
      const result = await db.collection(COLLECTION_NAME).deleteOne({ MaSach });
      if (result.deletedCount === 0) {
        throw new Error("Không tìm thấy sách để xóa");
      }
      return result;
    } catch (err) {
      console.error("delete error:", err);
      throw new Error("Lỗi khi xóa sách: " + err.message);
    }
  },
};
