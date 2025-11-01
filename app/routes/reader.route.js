import express from 'express';
import { getAllReaders, createReader } from '../controllers/reader.controller.js';

const router = express.Router();

router.get('/', getAllReaders);
router.post('/', createReader);

export default router;
