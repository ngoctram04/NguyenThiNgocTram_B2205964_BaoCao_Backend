import bookRepo from '../repositories/book.repository.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await bookRepo.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await bookRepo.insert(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await bookRepo.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

export const updateBook = async (req, res) => {
  try {
    const result = await bookRepo.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await bookRepo.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};
