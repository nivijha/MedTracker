import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X } from 'lucide-react';

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    type: 'Blood Test',
    date: '2024-03-15',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    status: 'Normal',
    icon: Flask
  },
  {
    id: 2,
    type: 'ECG',
    date: '2024-03-10',
    doctor: 'Dr. Michael Chen',
    hospital: 'Heart Care Center',
    status: 'Review Required',
    icon: Heart
  },
  {
    id: 3,
    type: 'X-Ray',
    date: '2024-03-05',
    doctor: 'Dr. Emily Wilson',
    hospital: 'City General Hospital',
    status: 'Normal',
    icon: FileText
  }
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
      <div className="flex-1">
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
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
            <p className="text-gray-600">View and manage all your medical test reports in one place</p>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <report.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    report.status === 'Normal' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.type}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Date: {report.date}</p>
                  <p>Doctor: {report.doctor}</p>
                  <p>Hospital: {report.hospital}</p>
                </div>
                <button className="mt-4 w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;