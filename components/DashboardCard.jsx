import React, { useState } from 'react';
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X , Calendar , Stethoscope, Import,} from 'lucide-react';


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

  export default DashboardCard