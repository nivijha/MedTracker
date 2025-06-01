const express = require('express');
const router = express.Router();
const { getAllMedicalRecords, addMedicalRecord } = require('../controllers/medicalRecordController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getAllMedicalRecords);
router.post('/', authenticateUser, addMedicalRecord);

module.exports = router;
