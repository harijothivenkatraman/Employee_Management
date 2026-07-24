import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineArrowLeft, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineMail, 
  HiOutlineCurrencyDollar, 
  HiOutlineCalendar, 
  HiOutlineIdentification,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';
import { employeeAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AVATAR_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getById(id);
        setEmployee(response.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const confirmDelete = async () => {
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      toast.error('Failed to delete employee');
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  const avatarColor = employee ? AVATAR_COLORS[employee.id % AVATAR_COLORS.length] : '#ccc';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 w-24 bg-gray-200 rounded mb-6"></div>
        <div className="glass-card p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card p-6 h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Not Found</h2>
        <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist or has been removed.</p>
        <Link to="/employees" className="btn btn-primary">Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/employees" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors">
        <HiOutlineArrowLeft className="h-5 w-5" />
        Back to Employees
      </Link>

      {/* Profile Card */}
      <div className="glass-card p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 z-0 opacity-50"></div>
        
        <div 
          className="avatar h-24 w-24 sm:h-20 sm:w-20 flex items-center justify-center rounded-full text-white text-3xl font-bold shadow-lg z-10 border-4 border-white"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(employee.firstName, employee.lastName)}
        </div>
        
        <div className="flex-1 text-center sm:text-left z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.firstName} {employee.lastName}</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="badge badge-primary text-sm px-3 py-1">{employee.department}</span>
            <span className="text-gray-500 flex items-center gap-1">
              <HiOutlineMail className="h-4 w-4" />
              {employee.email}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-3 mt-4 sm:mt-0 z-10">
            <Link to={`/employees/${employee.id}/edit`} className="btn btn-primary flex items-center gap-2">
              <HiOutlinePencil className="h-4 w-4" />
              Edit
            </Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger flex items-center gap-2">
              <HiOutlineTrash className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <InfoCard 
          icon={<HiOutlineOfficeBuilding className="h-6 w-6 text-blue-500" />}
          label="Department"
          value={employee.department}
        />
        <InfoCard 
          icon={<HiOutlineCurrencyDollar className="h-6 w-6 text-emerald-500" />}
          label="Salary"
          value={`$${employee.salary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <InfoCard 
          icon={<HiOutlineMail className="h-6 w-6 text-purple-500" />}
          label="Email Address"
          value={employee.email}
        />
        <InfoCard 
          icon={<HiOutlineIdentification className="h-6 w-6 text-amber-500" />}
          label="Employee ID"
          value={`EMP-${employee.id.toString().padStart(4, '0')}`}
        />
        <InfoCard 
          icon={<HiOutlineCalendar className="h-6 w-6 text-gray-500" />}
          label="Created Date"
          value={employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
        />
        <InfoCard 
          icon={<HiOutlineCalendar className="h-6 w-6 text-gray-500" />}
          label="Updated Date"
          value={employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString() : 'N/A'}
        />
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="modal-content bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Employee</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {employee.firstName} {employee.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="glass-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className="p-3 bg-gray-50 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

export default EmployeeDetails;
