const Medication = require('../models/Medication');

exports.getAllMedications = async (req, res) => {
  const medications = await Medication.find({ userId: req.user.id });
  res.json(medications);
};

exports.addMedication = async (req, res) => {
  const newMed = new Medication({ ...req.body, userId: req.user.id });
  await newMed.save();
  res.status(201).json(newMed);
};
