const express = require('express');
const router = express.Router();
const { getAllPrescriptions, addPrescription } = require('../controllers/prescriptionController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getAllPrescriptions);
router.post('/', authenticateUser, addPrescription);

module.exports = router;
