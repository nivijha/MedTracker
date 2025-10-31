import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X , Calendar , Stethoscope, Import, Link,} from 'lucide-react';
import Link from 'next/link';
import Router from 'next/router';
import Image from 'next/image';

import Report from '../components/Report';
import Settings from '../components/Settings';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';



const DashboardCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="p-6 space-y-2 bg-slate-100 rounded-lg border">
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <Icon className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);


const ActivityItem = ({ type, description, date, icon: Icon }) => (
  <div className="flex gap-4 py-4">
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
  <div className="p-6 bg-slate-100 rounded-lg border">
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





function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <>
 
    <div className="max-h-full bg-gray-50 flex h-screen">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-lg transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold ">MedTracker</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          
            <Navbar></Navbar>
          


        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

        <header className="bg-white shadow-sm">
          
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />

            </button>
            <div className="flex items-center space-x-4">
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <PlusCircle className="h-5 w-5" />
                <span>Add Report</span>
              </button>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
        <Routes>
        <Route path="/dashboard" element={<App />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your health information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Total Appointments"
          value="12"
          subtitle="2 upcoming this week"
          icon={Calendar}
        />
        
        <DashboardCard
          title="Test Results"
          value="8"
          subtitle="3 new since last month"
          icon={FileText}
        />
        
        <DashboardCard
          title="Active Medications"
          value="3"
          subtitle="1 prescription needs refill"
          icon={Activity}
        />
        
        <DashboardCard
          title="Next Check-up"
          value="Apr 15"
          subtitle="Annual physical exam"
          icon={Stethoscope}
        />
      </div>
      
      <RecentActivity />

      </div>



        </main>
      </div>
    </div>
    </>
  );
}

export default App;