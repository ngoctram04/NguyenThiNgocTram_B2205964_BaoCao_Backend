import MongoDB from "../utils/mongodb.util.js";

const collectionName = "DanhMuc";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaDanhMuc: id });
  },

  async insert(category) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(category);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaDanhMuc: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaDanhMuc: id });
  },
};
