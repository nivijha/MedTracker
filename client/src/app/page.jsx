import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import { ToastContainer } from '@/components/Toast';
import Layout from '@/components/Layout';

// Import pages
import Login from '@/App/login/page';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Records from '@/pages/Records';
import AddRecord from '@/pages/AddRecord';
import RecordDetail from '@/pages/RecordDetail';
import Profile from './profile/page';
import Settings from '@/components/Settings';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          
          {/* Protected routes with layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Nested routes */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="records" element={<Records />} />
            <Route path="records/add" element={<AddRecord />} />
            <Route path="records/:id" element={<RecordDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;