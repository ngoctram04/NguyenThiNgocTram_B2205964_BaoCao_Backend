import PublisherRepository from "../repositories/publisher.repository.js";

export const getAllPublishers = async (req, res) => {
  try {
    const publishers = await PublisherRepository.findAll();
    res.status(200).json(publishers);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách nhà xuất bản",
      error: err.message,
    });
  }
};

export const getPublisherById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const publisher = await PublisherRepository.findById(id);

    if (!publisher) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }

    res.status(200).json(publisher);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin nhà xuất bản",
      error: err.message,
    });
  }
};

export const createPublisher = async (req, res) => {
  try {
    const data = req.body;
    if (!data.TenNXB) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin bắt buộc: TenNXB" });
    }

    if (!data.MaNXB) {
      const allPublishers = await PublisherRepository.findAll();
      const maxId = allPublishers.reduce(
        (max, p) => Math.max(max, p.MaNXB || 0),
        0
      );
      data.MaNXB = maxId + 1;
    }

    await PublisherRepository.insert(data);
    res.status(201).json({ message: "Thêm nhà xuất bản thành công" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi thêm nhà xuất bản",
      error: err.message,
    });
  }
};

export const updatePublisher = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await PublisherRepository.update(id, req.body);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }

    res.status(200).json({ message: "Cập nhật nhà xuất bản thành công" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật nhà xuất bản",
      error: err.message,
    });
  }
};

export const deletePublisher = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await PublisherRepository.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhà xuất bản" });
    }

    res.status(200).json({ message: "Xóa nhà xuất bản thành công" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi xóa nhà xuất bản",
      error: err.message,
    });
  }
};
