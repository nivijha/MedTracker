import crypto from 'crypto';
import User from '../models/User.js';
import { 
  AppError, 
  ValidationError, 
  UnauthorizedError, 
  DuplicateError,
  catchAsync 
} from '../utils/errorHandler.js';

/**
 * Generate random token for email verification/password reset
 */
const createRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Send token response
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      status: 'success',
      message,
      token,
      data: {
        user: user.fullProfile
      }
    });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new ValidationError('Please provide name, email, and password'));
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return next(new ValidationError('Passwords do not match'));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new DuplicateError('email'));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate email verification token
  const verificationToken = createRandomToken();
  user.emailVerificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  console.log(`Email verification token for ${email}: ${verificationToken}`);

  sendTokenResponse(user, 201, res, 'User registered successfully. Please check your email to verify your account.');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ValidationError('Please provide email and password'));
  }

  // Check for user and include password
  const user = await User.findByEmailAndUnlocked(email);

  if (!user) {
    return next(new UnauthorizedError('Invalid email or password'));
  }

  // Check if password is correct
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    // Increment login attempts
    await user.incLoginAttempts();
    return next(new UnauthorizedError('Invalid email or password'));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   GET /api/auth/logout
 * @access  Private
 */
export const logout = catchAsync(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user: user.fullProfile
    }
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
export const updateDetails = catchAsync(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    address: req.body.address,
    emergencyContact: req.body.emergencyContact
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'User details updated successfully',
    data: {
      user: user.fullProfile
    }
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ValidationError('Please provide current password, new password, and confirmation'));
  }

  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    return next(new ValidationError('New passwords do not match'));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new UnauthorizedError('Current password is incorrect'));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ValidationError('There is no user with that email'));
  }

  // Get reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset email
  console.log(`Password reset token for ${user.email}: ${resetToken}`);

  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email'
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ValidationError('Invalid or expired reset token'));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verifyemail/:token
 * @access  Public
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken
  });

  if (!user) {
    return next(new ValidationError('Invalid or expired verification token'));
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Email verified successfully');
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resendverification
 * @access  Public
 */
export const resendVerification = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ValidationError('There is no user with that email'));
  }

  if (user.emailVerified) {
    return next(new ValidationError('Email is already verified'));
  }

  // Generate new verification token
  const verificationToken = createRandomToken();
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  console.log(`Email verification token for ${user.email}: ${verificationToken}`);

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent'
  });
});