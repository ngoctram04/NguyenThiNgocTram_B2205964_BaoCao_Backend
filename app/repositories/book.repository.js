import MongoDB from "../utils/mongodb.util.js";

const collectionName = "SACH";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaSach: id });
  },

  async insert(book) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(book);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaSach: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaSach: id });
  },
};
