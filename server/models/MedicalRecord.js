import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Medical record must belong to a user']
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the medical record'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify the type of medical record'],
    enum: [
      'lab-result',
      'prescription',
      'imaging',
      'vaccination',
      'surgery',
      'consultation',
      'allergy-test',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  doctor: {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    specialization: {
      type: String,
      trim: true
    },
    hospital: {
      type: String,
      trim: true
    },
    contact: {
      phone: String,
      email: String
    }
  },
  dateOfRecord: {
    type: Date,
    required: [true, 'Please provide the date of the medical record'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date of record cannot be in the future'
    }
  },
  dateOfNextVisit: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.dateOfRecord;
      },
      message: 'Next visit date must be after the record date'
    }
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String,
    active: {
      type: Boolean,
      default: true
    }
  }],
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical'],
      default: 'normal'
    }
  }],
  diagnosis: {
    primary: String,
    secondary: [String],
    notes: String
  },
  treatment: {
    plan: String,
    procedures: [String],
    followUp: String
  },
  tags: [{
    type: String,
    enum: ['urgent', 'chronic', 'follow-up', 'review', 'archived'],
    default: 'review'
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'ongoing'],
    default: 'active'
  },
  sharingSettings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    sharedWith: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  reminders: [{
    type: {
      type: String,
      enum: ['medication', 'appointment', 'follow-up', 'refill'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    date: {
      type: Date,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
medicalRecordSchema.index({ user: 1, dateOfRecord: -1 });
medicalRecordSchema.index({ user: 1, type: 1 });
medicalRecordSchema.index({ user: 1, status: 1 });
medicalRecordSchema.index({ 'doctor.name': 1 });

// Virtual for record age
medicalRecordSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfRecord) / (1000 * 60 * 60 * 24));
});

// Virtual for file count
medicalRecordSchema.virtual('fileCount').get(function() {
  return this.files ? this.files.length : 0;
});

// Virtual for active medications
medicalRecordSchema.virtual('activeMedications').get(function() {
  return this.medications ? this.medications.filter(med => med.active) : [];
});

// Virtual for pending reminders
medicalRecordSchema.virtual('pendingReminders').get(function() {
  const now = new Date();
  return this.reminders ? this.reminders.filter(reminder => 
    !reminder.isCompleted && reminder.date <= now
  ) : [];
});

// Pre-save middleware to calculate BMI if height and weight are provided
medicalRecordSchema.pre('save', function(next) {
  if (this.vitalSigns.height && this.vitalSigns.weight) {
    const heightInMeters = this.vitalSigns.height / 100;
    this.vitalSigns.bmi = Math.round(
      (this.vitalSigns.weight / (heightInMeters * heightInMeters)) * 100
    ) / 100;
  }
  next();
});

// Static method to get records by user with filters
medicalRecordSchema.statics.getByUser = function(userId, filters = {}) {
  const query = { user: userId, ...filters };
  return this.find(query)
    .sort({ dateOfRecord: -1 })
    .populate('user', 'name email');
};

// Static method to get upcoming reminders
medicalRecordSchema.statics.getUpcomingReminders = function(userId, days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $unwind: '$reminders' },
    { 
      $match: { 
        'reminders.date': { 
          $gte: new Date(),
          $lte: futureDate
        },
        'reminders.isCompleted': false
      }
    },
    { $sort: { 'reminders.date': 1 } },
    { $limit: 10 }
  ]);
};

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;