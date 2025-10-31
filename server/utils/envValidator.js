/**
 * Environment variable validation utility
 */

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT'
];

const optionalEnvVars = [
  'NODE_ENV',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'UPLOAD_PATH',
  'MAX_FILE_SIZE'
];

export const validateEnv = () => {
  const missingVars = [];
  
  // Check required environment variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  // If any required variables are missing, throw an error
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Set default values for optional variables
  const env = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10485760', // 10MB
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d'
  };
  
  console.log('✅ Environment variables validated');
  return env;
};

export const getEnvVar = (key, defaultValue = null) => {
  return process.env[key] || defaultValue;
};