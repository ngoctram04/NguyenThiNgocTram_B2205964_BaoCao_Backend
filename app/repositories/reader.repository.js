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

  async findByEmail(email) {
    const db = MongoDB.getDB();
    return await db.collection(collectionName).findOne({ Email: email });
  },

  async insert(reader) {
    const db = MongoDB.getDB();
    const last = await db
      .collection(collectionName)
      .find({})
      .sort({ MaDocGia: -1 })
      .limit(1)
      .toArray();

    let newMa = 1;
    if (last.length > 0) {
      newMa = last[0].MaDocGia + 1;
    }

    reader.MaDocGia = newMa;
    if (reader.Password) {
      reader.Password = await bcrypt.hash(reader.Password, 10);
    }

    const result = await db.collection(collectionName).insertOne(reader);
    return { MaDocGia: reader.MaDocGia, _id: result.insertedId };
  },

  async update(id, data) {
    const db = MongoDB.getDB();

    if (data.Password) {
      data.Password = await bcrypt.hash(data.Password, 10);
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
