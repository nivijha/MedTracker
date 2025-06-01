const MedicalRecord = require('../models/MedicalRecord');

exports.getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.user.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addMedicalRecord = async (req, res) => {
  try {
    const newRecord = new MedicalRecord({ ...req.body, userId: req.user.id });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add medical record' });
  }
};
