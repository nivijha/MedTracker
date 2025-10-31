import express from 'express';
import { body } from 'express-validator';
import {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  deleteFile,
  getReminders,
  updateReminder,
  getStats
} from '../controllers/recordController.js';
import { protect, checkOwnership } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation middleware
const validateCreateRecord = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('type')
    .isIn(['lab-result', 'prescription', 'imaging', 'vaccination', 'surgery', 'consultation', 'allergy-test', 'other'])
    .withMessage('Invalid record type'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('doctor.name')
    .trim()
    .notEmpty()
    .withMessage('Doctor name is required'),
  body('dateOfRecord')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (value && new Date(value) >= new Date()) {
        throw new Error('Date of record cannot be in the future');
      }
      return true;
    }),
  body('dateOfNextVisit')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid next visit date'),
  body('diagnosis.primary')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Primary diagnosis must be at least 2 characters'),
  body('vitalSigns.bloodPressure.systolic')
    .optional()
    .isInt({ min: 50, max: 250 })
    .withMessage('Systolic blood pressure must be between 50 and 250'),
  body('vitalSigns.bloodPressure.diastolic')
    .optional()
    .isInt({ min: 30, max: 150 })
    .withMessage('Diastolic blood pressure must be between 30 and 150'),
  body('vitalSigns.heartRate')
    .optional()
    .isInt({ min: 30, max: 200 })
    .withMessage('Heart rate must be between 30 and 200'),
  body('vitalSigns.temperature')
    .optional()
    .isFloat({ min: 35, max: 42 })
    .withMessage('Temperature must be between 35 and 42°C'),
  body('vitalSigns.weight')
    .optional()
    .isFloat({ min: 1, max: 500 })
    .withMessage('Weight must be between 1 and 500 kg'),
  body('vitalSigns.height')
    .optional()
    .isFloat({ min: 50, max: 250 })
    .withMessage('Height must be between 50 and 250 cm')
];

const validateUpdateRecord = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('type')
    .optional()
    .isIn(['lab-result', 'prescription', 'imaging', 'vaccination', 'surgery', 'consultation', 'allergy-test', 'other'])
    .withMessage('Invalid record type'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('doctor.name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Doctor name must be at least 2 characters'),
  body('dateOfRecord')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (value && new Date(value) >= new Date()) {
        throw new Error('Date of record cannot be in the future');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['active', 'resolved', 'ongoing'])
    .withMessage('Invalid status')
];

const validateReminder = [
  body('isCompleted')
    .isBoolean()
    .withMessage('isCompleted must be a boolean')
];

// Routes
router
  .route('/')
  .get(getRecords)
  .post(uploadSingle('files'), validateCreateRecord, createRecord);

router
  .route('/stats')
  .get(getStats);

router
  .route('/reminders')
  .get(getReminders);

router
  .route('/:id')
  .get(getRecord, checkOwnership())
  .put(uploadMultiple('files'), validateUpdateRecord, updateRecord, checkOwnership())
  .delete(deleteRecord, checkOwnership());

router
  .route('/:id/files/:fileId')
  .delete(deleteFile, checkOwnership());

router
  .route('/:id/reminders/:reminderId')
  .put(validateReminder, updateReminder, checkOwnership());

export default router;