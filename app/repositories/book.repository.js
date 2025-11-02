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

    if (!book.MaSach) {
      book.MaSach = Date.now().toString();
    }

    const result = await db.collection(collectionName).insertOne(book);

    return { _id: result.insertedId, ...book };
  },


  async update(id, data) {
    const db = MongoDB.getDB();

    delete data._id;

    const result = await db
      .collection(collectionName)
      .updateOne({ MaSach: id }, { $set: data });

    return result; 
  },

 
  async delete(id) {
    const db = MongoDB.getDB();
    const result = await db.collection(collectionName).deleteOne({ MaSach: id });
    return result; 
  },
};
