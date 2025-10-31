import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { UnauthorizedError, ForbiddenError, catchAsync } from '../utils/errorHandler.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('You are not logged in! Please log in to get access.'));
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
  }

  // 4) Check if user is active
  if (currentUser.loginAttempts >= 5 && currentUser.isLocked) {
    return next(new UnauthorizedError('Your account has been locked due to multiple failed login attempts. Please try again later.'));
  }

  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Restrict access to certain roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      // Just continue without user context
    }
  }

  next();
});

/**
 * Check if user owns the resource or is admin
 */
export const checkOwnership = (resourceField = 'user') => {
  return (req, res, next) => {
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    if (req.resource[resourceField].toString() !== req.user.id.toString()) {
      return next(new ForbiddenError('You can only access your own resources'));
    }

    next();
  };
};

/**
 * Rate limiting for authentication endpoints
 */
const loginAttempts = new Map();

export const authRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  // Clean up old entries
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.timestamp > windowMs) {
      loginAttempts.delete(key);
    }
  }

  // Check current attempts
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.count >= maxAttempts) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again later.'
    });
  }

  // Update attempts
  if (attempts) {
    attempts.count++;
    attempts.timestamp = now;
  } else {
    loginAttempts.set(ip, { count: 1, timestamp: now });
  }

  next();
};

/**
 * Validate email verification status
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return next(new UnauthorizedError('Please verify your email address to continue'));
  }
  next();
};