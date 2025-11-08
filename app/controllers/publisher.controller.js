import PublisherRepository from "../repositories/publisher.repository.js";

export const getAllPublishers = async (req, res) => {
  try {
    const publishers = await PublisherRepository.findAll();
    res.status(200).json(publishers);
  } catch (err) {
    console.error("getAllPublishers error:", err);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhà xuất bản",
      error: err.message,
    });
  }
};

export const getPublisherById = async (req, res) => {
  try {
    const id = Number(req.params.id?.toString().trim());
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    const publisher = await PublisherRepository.findById(id);
    if (!publisher) return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });

    res.status(200).json(publisher);
  } catch (err) {
    console.error("getPublisherById error:", err);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin nhà xuất bản",
      error: err.message,
    });
  }
};

export const createPublisher = async (req, res) => {
  try {
    const { TenNXB, DiaChi } = req.body;
    if (!TenNXB?.trim()) {
      return res.status(400).json({ message: "Tên NXB là bắt buộc" });
    }


    const allPublishers = await PublisherRepository.findAll();
    const maxId = allPublishers.reduce((max, p) => Math.max(max, p.MaNXB || 0), 0);
    const MaNXB = maxId + 1;

    const newPublisher = {
      MaNXB,
      TenNXB: TenNXB.trim(),
      DiaChi: DiaChi?.trim() || "",
    };

    const result = await PublisherRepository.insert(newPublisher);

    res.status(201).json({
      message: "Thêm nhà xuất bản thành công",
      data: newPublisher,
      result,
    });
  } catch (err) {
    console.error("createPublisher error:", err);
    res.status(500).json({
      message: "Lỗi khi thêm nhà xuất bản",
      error: err.message,
    });
  }
};

export const updatePublisher = async (req, res) => {
  try {
    const id = Number(req.params.id?.toString().trim());
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    const { TenNXB, DiaChi } = req.body;
    if (!TenNXB?.trim()) return res.status(400).json({ message: "Tên NXB là bắt buộc" });

    const result = await PublisherRepository.update(id, {
      TenNXB: TenNXB.trim(),
      DiaChi: DiaChi?.trim() || "",
    });

    if (!result || result.modifiedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản hoặc không có gì thay đổi" });
    }

    res.status(200).json({ message: "Cập nhật nhà xuất bản thành công", result });
  } catch (err) {
    console.error("updatePublisher error:", err);
    res.status(500).json({
      message: "Lỗi khi cập nhật nhà xuất bản",
      error: err.message,
    });
  }
};

export const deletePublisher = async (req, res) => {
  try {
    const id = Number(req.params.id?.toString().trim());
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    console.log("Attempting to delete MaNXB =", id); 

    const result = await PublisherRepository.delete(id);

    console.log("Delete result:", result); 

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }

    res.status(200).json({ message: "Xóa nhà xuất bản thành công", result });
  } catch (err) {
    console.error("deletePublisher error:", err);
    res.status(500).json({
      message: "Lỗi khi xóa nhà xuất bản",
      error: err.message,
    });
  }
};
