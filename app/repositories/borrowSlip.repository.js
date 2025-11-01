import MongoDB from "../utils/mongodb.util.js";

const collectionName = "PhieuMuon";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findById(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ MaPhieu: id });
  },

  async insert(borrowSlip) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(borrowSlip);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaPhieu: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaPhieu: id });
  },
};
