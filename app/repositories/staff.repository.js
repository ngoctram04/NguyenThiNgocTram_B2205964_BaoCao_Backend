import MongoDB from "../utils/mongodb.util.js";

const collectionName = "NhanVien";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MSNV: id });
  },

  async insert(staff) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(staff);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MSNV: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MSNV: id });
  },
};
