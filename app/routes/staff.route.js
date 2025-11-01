import express from 'express';
import { getAllStaffs, createStaff, getStaffById, updateStaff, deleteStaff } from '../controllers/staff.controller.js';

const router = express.Router();

router.get('/', getAllStaffs);
router.post('/', createStaff);
router.get('/:id', getStaffById);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
