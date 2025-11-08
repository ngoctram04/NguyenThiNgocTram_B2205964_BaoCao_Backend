import MongoDB from "../utils/mongodb.util.js";

const COLLECTION_NAME = "NHAXUATBAN";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");
    return await db.collection(COLLECTION_NAME).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaNXB = Number(id?.toString().trim());
    if (isNaN(MaNXB)) throw new Error("ID không hợp lệ");

    return await db.collection(COLLECTION_NAME).findOne({ MaNXB });
  },

  async insert(publisher) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    if (!publisher.TenNXB?.trim()) {
      throw new Error("Tên nhà xuất bản là bắt buộc");
    }

    if (!publisher.MaNXB) {
      const allPublishers = await db.collection(COLLECTION_NAME).find().toArray();
      const maxId = allPublishers.reduce((max, p) => Math.max(max, p.MaNXB || 0), 0);
      publisher.MaNXB = maxId + 1;
    }

    const doc = {
      MaNXB: Number(publisher.MaNXB),
      TenNXB: publisher.TenNXB.trim(),
      DiaChi: publisher.DiaChi?.trim() || "",
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(doc);
    return { ...doc, _id: result.insertedId };
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaNXB = Number(id?.toString().trim());
    if (isNaN(MaNXB)) throw new Error("ID không hợp lệ");

    if (!data.TenNXB?.trim()) {
      throw new Error("Tên nhà xuất bản là bắt buộc");
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { MaNXB },
      {
        $set: {
          TenNXB: data.TenNXB.trim(),
          DiaChi: data.DiaChi?.trim() || "",
        },
      }
    );
    return result;
  },

  async delete(id) {
    const db = MongoDB.getDB();
    if (!db) throw new Error("MongoDB chưa kết nối!");

    const MaNXB = Number(id?.toString().trim());
    if (isNaN(MaNXB)) throw new Error("ID không hợp lệ");

    const result = await db.collection(COLLECTION_NAME).deleteOne({ MaNXB });
    return result;
  },
};
