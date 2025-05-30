'use client'

import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X } from 'lucide-react';
import Navbar from "../../../components/Navbar";
import doge from '../../../../public/doge.jpeg'
import Image from 'next/image';

function Profile() {
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
              <span className="text-xl font-bold text-black">MedTracker</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {/* Personal Information */}
              <div className="bg-white p-6 rounded-2xl shadow-md col-span-1">
                <h2 className="text-xl font-semibold mb-4 text-black">Personal Information</h2>
                <div className="flex items-center mb-4">
                  {/* <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">Photo</span>
            </div> */}
                  <div >
                    <Image className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center" width={80} height={80} alt="" src="/doge.jpeg" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-black">John Doe</h3>
                    <p className="text-gray-500">Patient ID: 123456</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Male</strong>, 35 years old
                  </p>
                  <p className="text-gray-600">johndoe@example.com</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-black">Medical History</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-4" ></span>
                    <div>
                      <p>
                        <strong className='text-black'>Hypertension</strong> <span className="text-yellow-500">Active</span>
                      </p>
                      <p className="text-sm text-gray-500">Diagnosed: 2020</p>
                    </div>
                  </li>
                  <li className="flex items-center"> 
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-4"></span>
                    <div>
                      <p>
                        <strong className='text-black'>Type 2 Diabetes</strong> <span className="text-yellow-500">Active</span>
                      </p>
                      <p className="text-sm text-gray-500">Diagnosed: 2018</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-400 rounded-full mr-4"></span>
                    <div>
                      <p>
                        <strong className='text-black'>Appendectomy</strong> <span className="text-green-500">Resolved</span>
                      </p>
                      <p className="text-sm text-gray-500">Surgery: 2015</p>
                    </div>
                  </li>
                </ul>
              </div>
 
              {/* Account Settings */}
              <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 md:col-span-3">
                <h2 className="text-xl font-semibold mb-4 text-black">Account Settings</h2>
                <p className="text-gray-600 mb-4">Manage your account preferences and security settings</p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between text-black">
                    <p>Email Notifications</p>
                    <button className="toggle-input h-8 w-24 bg-gray-300 rounded-lg text-black" >Enable</button>
                  </div>
                  <div className="flex items-center justify-between text-black">
                    <p>Two-Factor Authentication</p>
                    <button className="toggle-input h-8 w-24 bg-gray-300 rounded-lg text-black" >Enable</button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button className="px-4 py-2 bg-gray-300 rounded-lg text-black">Change Password</button>
                  <button className="px-4 py-2 bg-black text-white rounded-lg">Update Profile</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;
