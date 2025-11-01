import MongoDB from "../utils/mongodb.util.js";

const collectionName = "PhieuMuonChiTiet";

export default {
  async findAll() {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find().toArray();
  },

  async findBySlip(maPhieu) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).find({ MaPhieu: maPhieu }).toArray();
  },

  async insert(detail) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(detail);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaChiTiet: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaChiTiet: id });
  },
};
