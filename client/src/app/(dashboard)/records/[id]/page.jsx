"use client"

import React from 'react';
import { useParams } from 'next/navigation';

const RecordDetail = () => {
  const params = useParams();
  const recordId = params.id;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Record Details</h1>
        <p className="text-gray-600">
          View detailed information about this medical record
        </p>
        <p className="text-sm text-gray-500">
          Record ID: {recordId}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-600">
          Record details will be implemented in Day 8
        </p>
      </div>
    </div>
  );
};

export default RecordDetail;