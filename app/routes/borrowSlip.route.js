import express from 'express';
import { getAllBorrowSlips, createBorrowSlip } from '../controllers/borrowSlip.controller.js';

const router = express.Router();
router.get('/', getAllBorrowSlips);
router.post('/', createBorrowSlip);
export default router;
