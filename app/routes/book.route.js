import express from 'express';
import { getAllBooks } from '../controllers/book.controller.js';
const router = express.Router();

router.get('/', getAllBooks);

export default router;
