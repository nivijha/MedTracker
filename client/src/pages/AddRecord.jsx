import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AddRecord = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'lab-result',
    description: '',
    doctor: {
      name: '',
      specialization: '',
      hospital: '',
      contact: {
        phone: '',
        email: ''
      }
    },
    dateOfRecord: new Date().toISOString().split('T')[0],
    dateOfNextVisit: '',
    diagnosis: {
      primary: '',
      secondary: [],
      notes: ''
    },
    treatment: {
      plan: '',
      procedures: [],
      followUp: ''
    },
    status: 'active',
    tags: ['review']
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  
  const { api } = useAuth();
  const navigate = useNavigate();

  // Record type options
  const recordTypes = [
    { value: 'lab-result', label: 'Lab Result' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'allergy-test', label: 'Allergy Test' },
    { value: 'other', label: 'Other' }
  ];

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'ongoing', label: 'Ongoing' }
  ];

  // Tag options
  const tagOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'chronic', label: 'Chronic' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'review', label: 'Review' },
    { value: 'archived', label: 'Archived' }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  // Remove file from list
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.doctor.name.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }
    
    if (!formData.dateOfRecord) {
      newErrors.dateOfRecord = 'Date of record is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData for file upload
      const data = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      
      // Add files
      files.forEach(file => {
        data.append('files', file);
      });
      
      const response = await api.post('/records', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        navigate('/records');
      } else {
        setErrors({ general: response.data.message || 'Failed to create record' });
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow sm:rounded-lg sm:px-10 py-6">
          <div className="px-4 py-5 sm:p-6 sm:pb-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Add Medical Record</h1>
                <p className="text-gray-600">
                  Fill in the information below to add a new medical record
                </p>
              </div>

              {/* Error message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Annual blood test results"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Record Type <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.type ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a type</option>
                        {recordTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateOfRecord" className="block text-sm font-medium text-gray-700">
                      Date of Record <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        id="dateOfRecord"
                        name="dateOfRecord"
                        type="date"
                        required
                        value={formData.dateOfRecord}
                        onChange={handleChange}
                        className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors.dateOfRecord ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe the medical record details"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Doctor Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                        Doctor Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          id="doctorName"
                          name="doctor.name"
                          type="text"
                          required
                          value={formData.doctor.name}
                          onChange={(e) => handleNestedChange('doctor', 'name', e.target.value)}
                          className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            errors.doctorName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Dr. John Smith"
                        />
                        {errors.doctorName && (
                          <p className="mt-2 text-sm text-red-600">{errors.doctorName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doctorSpecialization" className="block text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <div className="mt-1">
                        <input
                          id="doctorSpecialization"
                          name="doctor.specialization"
                          type="text"
                          value={formData.doctor.specialization}
                          onChange={(e) => handleNestedChange('doctor', 'specialization', e.target.value)}
                          className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Cardiologist"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                        Hospital/Clinic
                      </label>
                      <div className="mt-1">
                        <input
                          id="hospital"
                          name="doctor.hospital"
                          type="text"
                          value={formData.doctor.hospital}
                          onChange={(e) => handleNestedChange('doctor', 'hospital', e.target.value)}
                          className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="City General Hospital"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doctorPhone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          id="doctorPhone"
                          name="doctor.contact.phone"
                          type="tel"
                          value={formData.doctor.contact.phone}
                          onChange={(e) => handleNestedChange('doctor', 'contact', { ...formData.doctor.contact, phone: e.target.value })}
                          className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Medical Documents</h3>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 ${
                      dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop files here, or click to select
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </div>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Files:</h4>
                      <ul className="space-y-2">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Status and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags
                    </label>
                    <div className="mt-1">
                      <select
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: Array.isArray(e.target.value) ? e.target.value : [e.target.value] }))}
                        className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        multiple
                      >
                        {tagOptions.map(tag => (
                          <option key={tag.value} value={tag.value}>
                            {tag.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group relative flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" text="" />
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Record
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;