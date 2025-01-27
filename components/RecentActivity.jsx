import React from "react";
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X , Calendar , Stethoscope, Import,} from 'lucide-react';



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

  export default RecentActivity