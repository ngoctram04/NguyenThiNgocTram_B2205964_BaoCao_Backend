import MongoDB from "../utils/mongodb.util.js";

const collectionName = "TaiKhoan";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaTK: id });
  },

  async insert(account) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(account);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).updateOne({ MaTK: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaTK: id });
  },
};
