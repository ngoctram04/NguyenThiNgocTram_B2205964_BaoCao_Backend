import staffRepo from '../repositories/staff.repository.js';

export const getAllStaffs = async (req, res) => {
  try {
    const staffs = await staffRepo.findAll();
    res.status(200).json(staffs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

export const createStaff = async (req, res) => {
  try {
    const staff = await staffRepo.insert(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error creating staff", error });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await staffRepo.findById(req.params.id);
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const result = await staffRepo.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const result = await staffRepo.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error });
  }
};
