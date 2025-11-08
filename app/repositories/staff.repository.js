import MongoDB from "../utils/mongodb.util.js";
import bcrypt from "bcryptjs";

const COLLECTION_NAME = "NhanVien";

const collection = () => MongoDB.getDB().collection(COLLECTION_NAME);

export default {
  async createStaff(data) {
    try {
      const hashed = await bcrypt.hash(data.Password, 10);
      data.Password = hashed;
      const result = await collection().insertOne(data);
      return { _id: result.insertedId, ...data };
    } catch (err) {
      throw new Error("Lỗi khi tạo nhân viên: " + err.message);
    }
  },

  async getStaffByMSNV(MSNV) {
    try {
      return await collection().findOne({ MSNV });
    } catch (err) {
      throw new Error("Lỗi khi tìm nhân viên: " + err.message);
    }
  },

  async getAllStaffs() {
    try {
      return await collection().find().toArray();
    } catch (err) {
      throw new Error("Lỗi khi lấy danh sách nhân viên: " + err.message);
    }
  },

  async updateStaff(MSNV, data) {
    try {
      if (data.Password) {
        data.Password = await bcrypt.hash(data.Password, 10);
      }
      const result = await collection().updateOne({ MSNV }, { $set: data });
      return result;
    } catch (err) {
      throw new Error("Lỗi khi cập nhật nhân viên: " + err.message);
    }
  },

  async deleteStaff(MSNV) {
    try {
      const result = await collection().deleteOne({ MSNV });
      return result;
    } catch (err) {
      throw new Error("Lỗi khi xóa nhân viên: " + err.message);
    }
  },
};
