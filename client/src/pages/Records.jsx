import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Filter,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recordsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 0,
    total: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { api } = useAuth();

  // Fetch records on component mount and when filters change
  useEffect(() => {
    fetchRecords();
  }, [filters.type, filters.status, filters.dateFrom, filters.dateTo, filters.search, pagination.page]);

  // Fetch records function
  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        type: filters.type || undefined,
        status: filters.status || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        search: filters.search || undefined,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await recordsAPI.getRecords(params);
      
      if (response.success) {
        setRecords(response.data.records);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination,
          page: pagination.page
        }));
      } else {
        setError(response.message || 'Failed to fetch records');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset to first page when filters change
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: e.target.search.value }));
  };

  // Handle record deletion
  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        const response = await recordsAPI.deleteRecord(id);
        
        if (response.success) {
          // Remove record from state
          setRecords(prev => prev.filter(record => record._id !== id));
        } else {
          setError(response.message || 'Failed to delete record');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    }
  };

  // Record type options
  const recordTypes = [
    { value: '', label: 'All Types' },
    { value: 'lab-result', label: 'Lab Results' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'vaccination', label: 'Vaccinations' },
    { value: 'surgery', label: 'Surgeries' },
    { value: 'consultation', label: 'Consultations' },
    { value: 'allergy-test', label: 'Allergy Tests' },
    { value: 'other', label: 'Other' }
  ];

  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'ongoing', label: 'Ongoing' }
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
        <p className="text-gray-600">
          View and manage all your medical records
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Link
            to="/records/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Link>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1">
                <input
                  id="search"
                  name="search"
                  type="text"
                  placeholder="Search records..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Record Type
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {recordTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                Date From
              </label>
              <div className="mt-1">
                <input
                  id="dateFrom"
                  name="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                Date To
              </label>
              <div className="mt-1">
                <input
                  id="dateTo"
                  name="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  type: '',
                  status: '',
                  dateFrom: '',
                  dateTo: '',
                  search: ''
                });
                setShowFilters(false);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Records List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading records..." />
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or add a new record.
              </p>
              <div className="mt-6">
                <Link
                  to="/records/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Record
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {records.map(record => (
                <li key={record._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(record.status)}`}>
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">{record.title}</p>
                          <p className="text-xs text-gray-500">
                            {record.type} • {formatDate(record.dateOfRecord)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {record.files && record.files.length > 0 && (
                          <>
                            <span>{record.files.length} file{record.files.length > 1 ? 's' : ''}</span>
                            <span> • </span>
                          </>
                        )}
                        {record.doctor && record.doctor.name && (
                          <>
                            <span>Dr. {record.doctor.name}</span>
                            <span> • </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/records/${record._id}`}
                      className="inline-flex items-center p-1 border border-transparent rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    
                    <Link
                      to={`/records/${record._id}/edit`}
                      className="inline-flex items-center p-1 border border-transparent rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteRecord(record._id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Pagination */}
      {records.length > 0 && (
        <div className="bg-white px-4 py-3 sm:px-6 sm:rounded-lg sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {records.length} of {pagination.total} records
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="relative inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Previous</span>
              </button>
              
              <span className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-3 py-1 text-sm font-medium ${
                      pagination.page === i + 1
                        ? 'text-blue-600 bg-blue-100 border-blue-300'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    } rounded-md`}
                  >
                    {i + 1}
                  </button>
                ))}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="relative inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;