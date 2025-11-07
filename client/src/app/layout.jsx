"use client"

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
