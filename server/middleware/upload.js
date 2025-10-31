import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/errorHandler.js';

// ES6 module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  // Allowed file extensions
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileMime = file.mimetype;

  if (allowedMimes.includes(fileMime) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${fileExtension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per upload
  },
  fileFilter: fileFilter
});

// Single file upload middleware
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return next(err);
      }
      
      // Add file info to request for easy access
      if (req.file) {
        req.fileInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path
        };
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return next(err);
      }
      
      // Add file info to request for easy access
      if (req.files) {
        req.filesInfo = req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        }));
      }
      
      next();
    });
  };
};

// Get file info middleware (for accessing uploaded files)
export const getFileStats = (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  const fs = require('fs');
  
  if (!fs.existsSync(filePath)) {
    return next(new AppError('File not found', 404));
  }
  
  const stats = fs.statSync(filePath);
  
  // Set appropriate headers
  res.setHeader('Content-Type', getContentType(filename));
  res.setHeader('Content-Length', stats.size);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  req.fileStats = stats;
  next();
};

// Helper function to determine content type
const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

// Delete file middleware
export const deleteFile = (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  const fs = require('fs');
  
  if (!fs.existsSync(filePath)) {
    return next(new AppError('File not found', 404));
  }
  
  try {
    fs.unlinkSync(filePath);
    res.status(200).json({
      status: 'success',
      message: 'File deleted successfully'
    });
  } catch (error) {
    return next(new AppError('Error deleting file', 500));
  }
};

export default upload;