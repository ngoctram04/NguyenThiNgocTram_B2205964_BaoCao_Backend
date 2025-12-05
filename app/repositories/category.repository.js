import MongoDB from "../utils/mongodb.util.js";

const COLLECTION_NAME = "THELOAI";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");
    return await db.collection(COLLECTION_NAME).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaTL = Number(id?.toString().trim());
    if (isNaN(MaTL)) throw new Error("ID không hợp lệ");

    const category = await db.collection(COLLECTION_NAME).findOne({ MaTL });
    if (!category) throw new Error("Không tìm thấy thể loại");
    return category;
  },

  async insert(category) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    if (!category.TenTL?.trim()) {
      throw new Error("Tên thể loại là bắt buộc");
    }
    if (!category.MaTL) {
      const allCategories = await db.collection(COLLECTION_NAME).find().toArray();
      const maxId = allCategories.reduce((max, c) => Math.max(max, c.MaTL || 0), 0);
      category.MaTL = maxId + 1;
    }

    const doc = {
      MaTL: Number(category.MaTL),
      TenTL: category.TenTL.trim(),
      MoTa: category.MoTa?.trim() || "",
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(doc);
    return { ...doc, _id: result.insertedId };
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaTL = Number(id?.toString().trim());
    if (isNaN(MaTL)) throw new Error("ID không hợp lệ");

    if (!data.TenTL?.trim()) {
      throw new Error("Tên thể loại là bắt buộc");
    }

    const updateDoc = {
      TenTL: data.TenTL.trim(),
      MoTa: data.MoTa?.trim() || "",
    };

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { MaTL },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) throw new Error("Không tìm thấy thể loại để cập nhật");
    return result;
  },
  async delete(id) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaTL = Number(id?.toString().trim());
    if (isNaN(MaTL)) throw new Error("ID không hợp lệ");

    const result = await db.collection(COLLECTION_NAME).deleteOne({ MaTL });
    if (result.deletedCount === 0) throw new Error("Không tìm thấy thể loại để xóa");
    return result;
  },
};
