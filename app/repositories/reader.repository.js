import MongoDB from "../utils/mongodb.util.js";
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

  async insert(reader) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).insertOne(reader);
  },

  async update(id, data) {
    const db = MongoDB.getDB();
    return await db
      .collection(collectionName)
      .updateOne({ MaDocGia: id }, { $set: data });
  },

  async delete(id) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).deleteOne({ MaDocGia: id });
  },
};
