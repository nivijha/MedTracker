const Prescription = require('../models/prescription');

// GET all prescriptions for the logged in user
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST a new prescription
exports.addPrescription = async (req, res) => {
  try {
    const newPrescription = new Prescription({ ...req.body, userId: req.user.id });
    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add prescription' });
  }
};
