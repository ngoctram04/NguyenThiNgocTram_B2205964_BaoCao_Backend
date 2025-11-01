import readerRepo from '../repositories/reader.repository.js';

export const getAllReaders = async (req, res) => {
  try {
    const readers = await readerRepo.findAll();
    res.status(200).json(readers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching readers", error });
  }
};

export const createReader = async (req, res) => {
  try {
    const reader = await readerRepo.insert(req.body);
    res.status(201).json(reader);
  } catch (error) {
    res.status(500).json({ message: "Error creating reader", error });
  }
};

export const getReaderById = async (req, res) => {
  try {
    const reader = await readerRepo.findById(req.params.id);
    res.status(200).json(reader);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reader", error });
  }
};

export const updateReader = async (req, res) => {
  try {
    const result = await readerRepo.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating reader", error });
  }
};

export const deleteReader = async (req, res) => {
  try {
    const result = await readerRepo.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting reader", error });
  }
};
