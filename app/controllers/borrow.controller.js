import MongoDB from "../utils/mongodb.util.js";

export const getAllBorrows = async (req, res) => {
  const db = MongoDB.getDB();
  const borrows = await db.collection("TheoDoiMuonSach").find().toArray();
  res.json(borrows);
};

export const createBorrow = async (req, res) => {
  const db = MongoDB.getDB();
  await db.collection("TheoDoiMuonSach").insertOne(req.body);
  res.status(201).json({ message: "Tạo phiếu mượn thành công" });
};

export const updateBorrow = async (req, res) => {
  const { id } = req.params;
  const db = MongoDB.getDB();
  await db.collection("TheoDoiMuonSach").updateOne({ _id: id }, { $set: req.body });
  res.json({ message: "Cập nhật phiếu mượn thành công" });
};

export const deleteBorrow = async (req, res) => {
  const { id } = req.params;
  const db = MongoDB.getDB();
  await db.collection("TheoDoiMuonSach").deleteOne({ _id: id });
  res.json({ message: "Xóa phiếu mượn thành công" });
};
