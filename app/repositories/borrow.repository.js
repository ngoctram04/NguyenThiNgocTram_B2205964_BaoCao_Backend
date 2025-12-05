import MongoDB from "../utils/mongodb.util.js";

const COLLECTION_NAME = "THEODOIMUONSACH";

export default {
  async findAll() {
    try {
      const db = MongoDB.getDB();
      const list = await db.collection(COLLECTION_NAME).find().toArray();
      return list.map(b => ({ ...b, _id: b._id?.toString() }));
    } catch (err) {
      console.error("findAll error:", err);
      throw new Error(err.message);
    }
  },

  async findById(MaPhieu) {
    if (!MaPhieu) return null;
    try {
      const db = MongoDB.getDB();
      const doc = await db.collection(COLLECTION_NAME).findOne({ MaPhieu: MaPhieu.toString() });
      return doc ? { ...doc, _id: doc._id?.toString() } : null;
    } catch (err) {
      console.error("findById error:", err);
      throw new Error(err.message);
    }
  },

  async insert(data) {
    try {
      const db = MongoDB.getDB();
      if (!data.MaPhieu) data.MaPhieu = Date.now().toString();
      else data.MaPhieu = data.MaPhieu.toString();
      data.TienPhat = data.TienPhat ?? 0;
      data.TrangThai = data.TrangThai ?? 1;
      const result = await db.collection(COLLECTION_NAME).insertOne(data);
      return { _id: result.insertedId.toString(), ...data };
    } catch (err) {
      console.error("insert error:", err);
      throw new Error(err.message);
    }
  },

  async update(MaPhieu, data) {
    if (!MaPhieu) throw new Error("MaPhieu không hợp lệ");
    try {
      const db = MongoDB.getDB();
      const result = await db.collection(COLLECTION_NAME).updateOne(
        { MaPhieu: MaPhieu.toString() },
        { $set: data }
      );
      if (result.matchedCount === 0) throw new Error("Không tìm thấy phiếu để cập nhật");
      return result;
    } catch (err) {
      console.error("update error:", err);
      throw new Error(err.message);
    }
  },

  async delete(MaPhieu) {
    if (!MaPhieu) throw new Error("MaPhieu không hợp lệ");
    try {
      const db = MongoDB.getDB();
      const result = await db.collection(COLLECTION_NAME).deleteOne({ MaPhieu: MaPhieu.toString() });
      if (result.deletedCount === 0) throw new Error("Không tìm thấy phiếu để xóa");
      return result;
    } catch (err) {
      console.error("delete error:", err);
      throw new Error(err.message);
    }
  },

  async findByReader(MaDocGia) {
    if (!MaDocGia) return [];
    try {
      const db = MongoDB.getDB();
      const MaDocGiaQuery = isNaN(MaDocGia) ? MaDocGia.toString() : Number(MaDocGia);
      const list = await db
        .collection(COLLECTION_NAME)
        .find({ MaDocGia: MaDocGiaQuery })
        .toArray();
      return list.map(b => ({ ...b, _id: b._id?.toString() }));
    } catch (err) {
      console.error("findByReader error:", err);
      throw new Error(err.message);
    }
  },

  async findOverdue() {
    try {
      const db = MongoDB.getDB();
      const now = new Date();
      const list = await db
        .collection(COLLECTION_NAME)
        .find({ TrangThai: 2, NgayTraDuKien: { $lt: now } })
        .toArray();
      return list.map(b => ({ ...b, _id: b._id?.toString() }));
    } catch (err) {
      console.error("findOverdue error:", err);
      throw new Error(err.message);
    }
  },

  async statsByMonthYear(month, year) {
    try {
      const db = MongoDB.getDB();
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const pipeline = [
        { $match: { NgayMuon: { $gte: start, $lt: end } } },
        { $group: {
            _id: null,
            borrowed: { $sum: { $cond: [{ $eq: ["$TrangThai", 2] }, 1, 0] } },
            returned: { $sum: { $cond: [{ $eq: ["$TrangThai", 3] }, 1, 0] } },
            late: { $sum: { 
              $cond: [
                { $and: [
                  { $eq: ["$TrangThai", 3] },
                  { $gt: ["$NgayTraThucTe", "$NgayTraDuKien"] }
                ]}, 1, 0 
              ] 
            } },
            fined: { $sum: { $cond: [{ $gt: ["$TienPhat", 0] }, 1, 0] } }
          }
        }
      ];

      const res = await db.collection(COLLECTION_NAME).aggregate(pipeline).toArray();
      if (res.length > 0) return res[0];
      return { borrowed: 0, returned: 0, late: 0, fined: 0 };
    } catch (err) {
      console.error("statsByMonthYear error:", err);
      return { borrowed: 0, returned: 0, late: 0, fined: 0 };
    }
  }
};
