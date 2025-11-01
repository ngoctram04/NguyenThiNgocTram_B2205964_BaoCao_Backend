import categoryRepo from '../repositories/category.repository.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryRepo.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await categoryRepo.insert(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryRepo.findById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const result = await categoryRepo.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const result = await categoryRepo.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
