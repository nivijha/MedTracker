import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X , Calendar , Stethoscope, Import,} from 'lucide-react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Report from '../components/Report';
import Settings from '../components/Settings';
import Profile from '../components/Profile';
import DashboardCard from '../components/DashboardCard';
import RecentActivity from '../components/RecentActivity';

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
              <span className="text-xl font-bold">MedTracker</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {['Dashboard', 'Reports', 'Profile', 'Settings'].map((item) => (
              <button
                key={item}
                className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                {item === 'Dashboard' && <LayoutDashboard className="h-5 w-5" />}
                {item === 'Reports' && <FileText className="h-5 w-5" />}
                {item === 'Profile' && <User className="h-5 w-5" />}
                
                <span>{item}</span>
              </button>
            ))}
          </nav>
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