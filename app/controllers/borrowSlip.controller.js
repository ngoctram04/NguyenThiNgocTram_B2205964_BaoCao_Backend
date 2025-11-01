import borrowSlipRepo from '../repositories/borrowSlip.repository.js';

export const getAllBorrowSlips = async (req, res) => {
  try {
    const slips = await borrowSlipRepo.findAll();
    res.status(200).json(slips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrow slips", error });
  }
};

export const createBorrowSlip = async (req, res) => {
  try {
    const slip = await borrowSlipRepo.insert(req.body);
    res.status(201).json(slip);
  } catch (error) {
    res.status(500).json({ message: "Error creating borrow slip", error });
  }
};

export const getBorrowSlipById = async (req, res) => {
  try {
    const slip = await borrowSlipRepo.findById(req.params.id);
    res.status(200).json(slip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrow slip", error });
  }
};

export const updateBorrowSlip = async (req, res) => {
  try {
    const result = await borrowSlipRepo.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating borrow slip", error });
  }
};

export const deleteBorrowSlip = async (req, res) => {
  try {
    const result = await borrowSlipRepo.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting borrow slip", error });
  }
};
