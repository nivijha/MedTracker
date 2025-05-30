import Navbar from './Navbar.tsx'
import React from 'react'

export default function Sidebar() {
    return(
        
    <>
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
                        <span className="text-xl font-bold ">MedTracker</span>
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
    </div>
</>
    )
}