import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from '../components/Toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('medtracker_token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_LOADING = 'SET_LOADING';
const UPDATE_USER = 'UPDATE_USER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('medtracker_token', state.token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('medtracker_token');
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('medtracker_token');
      
      if (token) {
        try {
          dispatch({ type: SET_LOADING, payload: true });
          
          const response = await api.get('/auth/me');
          
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data.data.user,
              token
            }
          });
        } catch (error) {
          dispatch({
            type: AUTH_FAILURE,
            payload: error.response?.data?.message || 'Authentication failed'
          });
          localStorage.removeItem('medtracker_token');
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.post('/auth/register', userData);
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data.data.user,
          token: response.data.token
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.post('/auth/login', { email, password });
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data.data.user,
          token: response.data.token
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.put('/auth/updatedetails', userData);
      
      dispatch({
        type: UPDATE_USER,
        payload: response.data.data.user
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.put('/auth/updatepassword', passwordData);
      
      // Update token if new one is provided
      if (response.data.token) {
        dispatch({
          type: AUTH_SUCCESS,
          payload: {
            user: response.data.data.user,
            token: response.data.token
          }
        });
      }

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.post('/auth/forgotpassword', { email });
      
      dispatch({ type: CLEAR_ERROR });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const response = await api.put(`/auth/resetpassword/${token}`, { password });
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          user: response.data.data.user,
          token: response.data.token
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const [toasts, setToasts] = useState([]);
  
  const addToast = (toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  };
  
  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    clearError,
    api,
    addToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;