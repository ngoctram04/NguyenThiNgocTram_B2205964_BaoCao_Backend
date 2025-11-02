import MongoDB from "../utils/mongodb.util.js";

const collectionName = "NHAXUATBAN";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaNXB: id });
  },

  async insert(publisher) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(publisher);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaNXB: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaNXB: id });
  },
};
