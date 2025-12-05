import CategoryRepository from "../repositories/category.repository.js";

export default {
  async getAll(req, res) {
    try {
      const categories = await CategoryRepository.findAll();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const category = await CategoryRepository.findById(req.params.id);
      res.json(category);
    } catch (err) {
      console.error(err);
      if (err.message.includes("Không tìm thấy")) {
        return res.status(404).json({ message: err.message });
      }
      if (err.message.includes("ID không hợp lệ")) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  async create(req, res) {
    try {
      const category = await CategoryRepository.insert(req.body);
      res.status(201).json({ message: "Thêm thể loại thành công", category });
    } catch (err) {
      console.error(err);
      if (err.message.includes("bắt buộc")) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  async update(req, res) {
    try {
      await CategoryRepository.update(req.params.id, req.body);
      res.json({ message: "Cập nhật thể loại thành công" });
    } catch (err) {
      console.error(err);
      if (err.message.includes("Không tìm thấy")) {
        return res.status(404).json({ message: err.message });
      }
      if (err.message.includes("bắt buộc") || err.message.includes("ID không hợp lệ")) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await CategoryRepository.delete(req.params.id);
      res.json({ message: "Xóa thể loại thành công" });
    } catch (err) {
      console.error(err);
      if (err.message.includes("Không tìm thấy") || err.message.includes("ID không hợp lệ")) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryRepository.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
