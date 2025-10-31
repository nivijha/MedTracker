import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medtracker_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('medtracker_token');
        window.location.href = '/login';
      }
      
      // Handle forbidden errors
      if (status === 403) {
        console.error('Access forbidden:', data?.message || 'You do not have permission to perform this action');
      }
      
      // Handle validation errors
      if (status === 422) {
        console.error('Validation error:', data?.errors || 'Invalid data provided');
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data?.message || 'Internal server error');
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Logout user
  logout: async () => {
    const response = await api.get('/auth/logout');
    return response.data;
  },
  
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },
  
  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
  },
  
  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
  }
};

// Medical Records API calls
export const recordsAPI = {
  // Get all records
  getRecords: async (params = {}) => {
    const response = await api.get('/records', { params });
    return response.data;
  },
  
  // Get single record
  getRecord: async (id) => {
    const response = await api.get(`/records/${id}`);
    return response.data;
  },
  
  // Create new record
  createRecord: async (recordData) => {
    const response = await api.post('/records', recordData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  // Update record
  updateRecord: async (id, recordData) => {
    const response = await api.put(`/records/${id}`, recordData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  // Delete record
  deleteRecord: async (id) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  },
  
  // Delete file from record
  deleteFile: async (recordId, fileId) => {
    const response = await api.delete(`/records/${recordId}/files/${fileId}`);
    return response.data;
  },
  
  // Get record statistics
  getStats: async () => {
    const response = await api.get('/records/stats');
    return response.data;
  },
  
  // Get upcoming reminders
  getReminders: async (days = 7) => {
    const response = await api.get('/records/reminders', { 
      params: { days } 
    });
    return response.data;
  },
  
  // Update reminder
  updateReminder: async (recordId, reminderId, reminderData) => {
    const response = await api.put(`/records/${recordId}/reminders/${reminderId}`, reminderData);
    return response.data;
  }
};

// File upload helper
export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        
        if (onUploadProgress) {
          onUploadProgress(progress);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Error handling helper
export const handleApiError = (error, customMessage = null) => {
  if (error.response) {
    const { status, data } = error.response;
    
    if (status === 401) {
      return 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (status === 404) {
      return 'The requested resource was not found.';
    } else if (status === 422) {
      return data?.message || 'The provided data is invalid.';
    } else if (status >= 500) {
      return 'A server error occurred. Please try again later.';
    } else {
      return customMessage || data?.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    return 'Network error. Please check your internet connection.';
  } else {
    return customMessage || 'An unexpected error occurred.';
  }
};

export default api;