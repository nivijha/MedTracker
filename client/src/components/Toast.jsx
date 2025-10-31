"use client"

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  showProgress = false,
  progress = 0 
}) => {
  const [visible, setVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    setVisible(true);
    
    // Auto-hide after duration
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    // Update progress if needed
    if (showProgress) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev < 100) {
            return prev + 1;
          }
          return prev;
        });
      }, duration / 100);
      
      return () => clearInterval(interval);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [duration, showProgress, progress]);

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get background color based on type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Get text color based on type
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  // Handle close
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full sm:max-w-md">
      <div className={`rounded-lg shadow-lg p-4 ${getBgColor()} ${getTextColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">{title}</p>
            )}
            <div className="text-sm">
              {message}
            </div>
          </div>
          <button
            type="button"
            className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Progress bar if needed */}
        {showProgress && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <p className="text-xs text-center mt-1">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast container to manage multiple toasts
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  };
  
  return { addToast };
};

export default Toast;