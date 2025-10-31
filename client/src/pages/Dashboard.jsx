"use client"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  FileText,
  Calendar,
  Heart,
  PlusCircle,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
  };

  return (
    <div className={`p-6 space-y-2 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
        {trend && (
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 ml-1">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ type, description, date, icon: Icon }) => (
  <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="mt-1">
      <Icon className="w-5 h-5 text-gray-500" />
    </div>
    <div className="flex-1 space-y-1">
      <p className="font-medium text-gray-900">{type}</p>
      <p className="text-gray-600">{description}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="p-6 bg-white rounded-lg shadow border">
    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
    <div className="divide-y divide-gray-100">
      <ActivityItem
        type="Appointment"
        description="General check-up with Dr. Johnson"
        date="2024-03-20"
        icon={Calendar}
      />
      <ActivityItem
        type="Test Result"
        description="Blood test results available"
        date="2024-03-18"
        icon={FileText}
      />
      <ActivityItem
        type="Medication"
        description="Prescription refill for Lisinopril"
        date="2024-03-15"
        icon={Activity}
      />
    </div>
  </div>
);

const QuickActions = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Link
      to="/records/add"
      className="flex items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <PlusCircle className="w-6 h-6 mr-2" />
      <span>Add Medical Record</span>
    </Link>
    <Link
      to="/appointments"
      className="flex items-center justify-center p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Calendar className="w-6 h-6 mr-2" />
      <span>Schedule Appointment</span>
    </Link>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecords: 0,
    upcomingAppointments: 0,
    activeMedications: 0,
    recentTests: 0
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalRecords: 12,
        upcomingAppointments: 2,
        activeMedications: 3,
        recentTests: 8
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your health information.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Records"
          value={stats.totalRecords}
          subtitle="2 added this month"
          icon={FileText}
          color="blue"
          trend="+12%"
        />
        <DashboardCard
          title="Appointments"
          value={stats.upcomingAppointments}
          subtitle="2 upcoming this week"
          icon={Calendar}
          color="green"
        />
        <DashboardCard
          title="Active Medications"
          value={stats.activeMedications}
          subtitle="1 needs refill"
          icon={Activity}
          color="yellow"
        />
        <DashboardCard
          title="Recent Tests"
          value={stats.recentTests}
          subtitle="3 new results"
          icon={Heart}
          color="red"
          trend="+25%"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;