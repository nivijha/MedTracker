'use client'

import React, { useState } from 'react';
import reports from '../../../utils/reports.json'
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X } from 'lucide-react';
import Navbar from "../../../components/Navbar";

function Report() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);




  return (



    <div className="max-h-full bg-gray-50 flex h-screen">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-0"
          } bg-white shadow-lg transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold  text-black">MedTracker</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
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
          <div className="min-h-screen bg-slate p-6 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-2 text-black">Medical Reports</h2>
              <p className="text-gray-600 mb-6">
                View and manage all your medical test reports
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200 text-black">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 border border-gray-200">Type</th>
                      <th className="text-left px-4 py-2 border border-gray-200">Status</th>
                      <th className="text-left px-4 py-2 border border-gray-200">Date</th>
                      <th className="text-left px-4 py-2 border border-gray-200">Doctor</th>
                      <th className="text-left px-4 py-2 border border-gray-200">Hospital</th>
                      <th className="text-center px-4 py-2 border border-gray-200">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">{report.type}</td>
                        <td className="px-4 py-2 border border-gray-200">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${report.statusColor}`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 border border-gray-200">{report.date}</td>
                        <td className="px-4 py-2 border border-gray-200">{report.doctor}</td>
                        <td className="px-4 py-2 border border-gray-200">{report.hospital}</td>
                        <td className="px-4 py-2 border border-gray-200 text-center">
                          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                            {report.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Report;
