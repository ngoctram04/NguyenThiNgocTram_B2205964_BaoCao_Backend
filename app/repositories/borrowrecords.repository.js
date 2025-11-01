import MongoDB from "../utils/mongodb.util.js";

const collectionName = "THEODOIMUONSACH";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findByReaderId(readerId) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find({ MaDocGia: readerId }).toArray();
  },

  async insert(record) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(record);
  },

  async update(readerId, bookId, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaDocGia: readerId, MaSach: bookId }, { $set: data });
  },

  async delete(readerId, bookId) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .deleteOne({ MaDocGia: readerId, MaSach: bookId });
  },
};
