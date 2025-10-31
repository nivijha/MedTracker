import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MedicalRecord from '../models/MedicalRecord.js';
import { 
  AppError, 
  ValidationError, 
  NotFoundError,
  catchAsync 
} from '../utils/errorHandler.js';

// ES6 module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Get all medical records for a user
 * @route   GET /api/records
 * @access  Private
 */
export const getRecords = catchAsync(async (req, res, next) => {
  // Build query filters
  const filters = {};
  
  if (req.query.type) {
    filters.type = req.query.type;
  }
  
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  if (req.query.dateFrom || req.query.dateTo) {
    filters.dateOfRecord = {};
    if (req.query.dateFrom) {
      filters.dateOfRecord.$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      filters.dateOfRecord.$lte = new Date(req.query.dateTo);
    }
  }
  
  if (req.query.search) {
    filters.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { 'doctor.name': { $regex: req.query.search, $options: 'i' } },
      { diagnosis: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Execute query
  const records = await MedicalRecord.getByUser(req.user.id, filters)
    .skip(skip)
    .limit(limit);

  const total = await MedicalRecord.countDocuments({ user: req.user.id, ...filters });

  res.status(200).json({
    status: 'success',
    results: records.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: {
      records
    }
  });
});

/**
 * @desc    Get single medical record
 * @route   GET /api/records/:id
 * @access  Private
 */
export const getRecord = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('user', 'name email');

  if (!record) {
    return next(new NotFoundError('Medical record'));
  }

  // Set resource for ownership check middleware
  req.resource = record;

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

/**
 * @desc    Create new medical record
 * @route   POST /api/records
 * @access  Private
 */
export const createRecord = catchAsync(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user.id;

  // Process uploaded files if any
  if (req.files && req.files.length > 0) {
    req.body.files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));
  }

  const record = await MedicalRecord.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Medical record created successfully',
    data: {
      record
    }
  });
});

/**
 * @desc    Update medical record
 * @route   PUT /api/records/:id
 * @access  Private
 */
export const updateRecord = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!record) {
    return next(new NotFoundError('Medical record'));
  }

  // Set resource for ownership check middleware
  req.resource = record;

  // Process new files if any
  if (req.files && req.files.length > 0) {
    const newFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));
    
    req.body.files = [...(record.files || []), ...newFiles];
  }

  const updatedRecord = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Medical record updated successfully',
    data: {
      record: updatedRecord
    }
  });
});

/**
 * @desc    Delete medical record
 * @route   DELETE /api/records/:id
 * @access  Private
 */
export const deleteRecord = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!record) {
    return next(new NotFoundError('Medical record'));
  }

  // Set resource for ownership check middleware
  req.resource = record;

  // Delete associated files from filesystem
  if (record.files && record.files.length > 0) {
    record.files.forEach(file => {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  await MedicalRecord.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Medical record deleted successfully'
  });
});

/**
 * @desc    Delete file from medical record
 * @route   DELETE /api/records/:id/files/:fileId
 * @access  Private
 */
export const deleteFile = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!record) {
    return next(new NotFoundError('Medical record'));
  }

  // Find the file to delete
  const fileIndex = record.files.findIndex(
    file => file._id.toString() === req.params.fileId
  );

  if (fileIndex === -1) {
    return next(new NotFoundError('File'));
  }

  const fileToDelete = record.files[fileIndex];

  // Delete file from filesystem
  const filePath = path.join(__dirname, '../uploads', fileToDelete.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove file from record
  record.files.splice(fileIndex, 1);
  await record.save();

  res.status(200).json({
    status: 'success',
    message: 'File deleted successfully'
  });
});

/**
 * @desc    Get upcoming reminders
 * @route   GET /api/records/reminders
 * @access  Private
 */
export const getReminders = catchAsync(async (req, res, next) => {
  const days = parseInt(req.query.days, 10) || 7;
  const reminders = await MedicalRecord.getUpcomingReminders(req.user.id, days);

  res.status(200).json({
    status: 'success',
    results: reminders.length,
    data: {
      reminders
    }
  });
});

/**
 * @desc    Update reminder status
 * @route   PUT /api/records/:id/reminders/:reminderId
 * @access  Private
 */
export const updateReminder = catchAsync(async (req, res, next) => {
  const record = await MedicalRecord.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!record) {
    return next(new NotFoundError('Medical record'));
  }

  // Find the reminder
  const reminder = record.reminders.id(req.params.reminderId);
  if (!reminder) {
    return next(new NotFoundError('Reminder'));
  }

  // Update reminder
  reminder.isCompleted = req.body.isCompleted;
  if (req.body.isCompleted) {
    reminder.completedAt = new Date();
  } else {
    reminder.completedAt = undefined;
  }

  await record.save();

  res.status(200).json({
    status: 'success',
    message: 'Reminder updated successfully',
    data: {
      reminder
    }
  });
});

/**
 * @desc    Get record statistics
 * @route   GET /api/records/stats
 * @access  Private
 */
export const getStats = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const stats = await MedicalRecord.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        activeRecords: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        resolvedRecords: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        typeDistribution: {
          $push: '$type'
        },
        latestRecord: { $max: '$dateOfRecord' }
      }
    },
    {
      $project: {
        _id: 0,
        totalRecords: 1,
        activeRecords: 1,
        resolvedRecords: 1,
        typeDistribution: 1,
        latestRecord: 1
      }
    }
  ]);

  const typeStats = await MedicalRecord.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || {
        totalRecords: 0,
        activeRecords: 0,
        resolvedRecords: 0,
        typeDistribution: [],
        latestRecord: null
      },
      typeStats
    }
  });
});