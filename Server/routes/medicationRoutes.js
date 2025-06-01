const express = require('express');
const router = express.Router();
const { getAllMedications, addMedication } = require('../controllers/medicationController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getAllMedications);
router.post('/', authenticateUser, addMedication);

module.exports = router;
