import MongoDB from "../utils/mongodb.util.js";
import bcrypt from "bcrypt";

const collectionName = "DOCGIA";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaDocGia: id });
  },

  // Tìm theo username/email để login
  async findByUsername(username) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ username });
  },

  // Thêm độc giả mới, hash password trước khi lưu
  async insert(reader) {
    const db = MongoDB.getDB();
    if (reader.password) {
      reader.password = await bcrypt.hash(reader.password, 10);
    }
    return await db.collection(collectionName).insertOne(reader);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    // Nếu có password mới, hash trước khi cập nhật
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await db
      .collection(collectionName)
      .updateOne({ MaDocGia: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaDocGia: id });
  },
};
