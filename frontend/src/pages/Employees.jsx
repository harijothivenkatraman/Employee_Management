import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiOutlineSearch, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineEye, 
  HiOutlinePlus, 
  HiOutlineDownload,
  HiOutlineArrowUp,
  HiOutlineArrowDown
} from 'react-icons/hi';
import { employeeAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import toast from 'react-hot-toast';

const AVATAR_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  
  // Pagination & Sorting state
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  
  // Filter state
  const [keyword, setKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [departments, setDepartments] = useState([]);
  
  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let response;
      if (keyword) {
        response = await employeeAPI.search({ keyword, pageNo, pageSize });
      } else {
        response = await employeeAPI.getAll({ pageNo, pageSize, sortBy, sortDir });
      }
      
      const { content, totalElements: total } = response.data;
      setEmployees(content || []);
      setTotalElements(total || 0);

      // Extract unique departments if we haven't already
      if (departments.length === 0 && content) {
        const uniqueDepts = [...new Set(content.map(emp => emp.department).filter(Boolean))];
        setDepartments(uniqueDepts);
      }
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [pageNo, pageSize, sortBy, sortDir, keyword]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await employeeAPI.delete(employeeToDelete.id);
      toast.success('Employee deleted successfully');
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department', 'Salary'];
    const csvData = employees.map(e => [
      e.id, e.firstName, e.lastName, e.email, e.department, e.salary
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (index) => AVATAR_COLORS[index % AVATAR_COLORS.length];

  const filteredEmployees = useMemo(() => {
    if (!selectedDept) return employees;
    return employees.filter(emp => emp.department === selectedDept);
  }, [employees, selectedDept]);

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDir === 'asc' ? <HiOutlineArrowUp className="inline ml-1" /> : <HiOutlineArrowDown className="inline ml-1" />;
  };

  return (
    <div className="animate-fade-in pb-8">
      <Header title="Employees" subtitle="Manage your team members" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Action Bar */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="form-input pl-10"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPageNo(0);
                }}
              />
            </div>
            <select 
              className="form-input w-48"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={exportCSV} className="btn btn-outline flex items-center gap-2 flex-1 sm:flex-none justify-center">
              <HiOutlineDownload className="h-5 w-5" />
              Export CSV
            </button>
            {isAdmin && (
              <Link to="/employees/add" className="btn btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center">
                <HiOutlinePlus className="h-5 w-5" />
                Add Employee
              </Link>
            )}
          </div>
        </div>

        {/* Employee Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="cursor-pointer" onClick={() => handleSort('firstName')}>
                    Employee <SortIcon column="firstName" />
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('email')}>
                    Email <SortIcon column="email" />
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('department')}>
                    Department <SortIcon column="department" />
                  </th>
                  <th className="cursor-pointer" onClick={() => handleSort('salary')}>
                    Salary <SortIcon column="salary" />
                  </th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: pageSize }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="p-4"><div className="h-10 w-48 bg-gray-200 rounded"></div></td>
                      <td className="p-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                      <td className="p-4"><div className="h-6 w-24 bg-gray-200 rounded-full"></div></td>
                      <td className="p-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
                      <td className="p-4"><div className="h-8 w-24 bg-gray-200 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td className="p-4 flex items-center gap-3">
                        <div 
                          className="avatar h-10 w-10 flex items-center justify-center rounded-full text-white font-bold"
                          style={{ backgroundColor: getAvatarColor(index) }}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <span className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                      </td>
                      <td className="p-4 text-gray-600">{emp.email}</td>
                      <td className="p-4">
                        <span className="badge badge-primary">{emp.department}</span>
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        ${emp.salary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/employees/${emp.id}`} className="btn-ghost btn-icon btn-sm rounded-full text-gray-600 hover:text-blue-600" title="View">
                            <HiOutlineEye className="h-5 w-5" />
                          </Link>
                          {isAdmin && (
                            <>
                              <Link to={`/employees/${emp.id}/edit`} className="btn-ghost btn-icon btn-sm rounded-full text-gray-600 hover:text-green-600" title="Edit">
                                <HiOutlinePencil className="h-5 w-5" />
                              </Link>
                              <button 
                                onClick={() => handleDeleteClick(emp)} 
                                className="btn-ghost btn-icon btn-sm rounded-full text-gray-600 hover:text-red-600" 
                                title="Delete"
                              >
                                <HiOutlineTrash className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && (
            <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min(pageNo * pageSize + 1, totalElements)} to {Math.min((pageNo + 1) * pageSize, totalElements)} of {totalElements} results
              </div>
              <div className="flex items-center gap-2">
                <select 
                  className="form-input py-1 text-sm mr-4"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNo(0);
                  }}
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <button 
                  disabled={pageNo === 0}
                  onClick={() => setPageNo(p => p - 1)}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.max(1, Math.ceil(totalElements / pageSize)) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPageNo(i)}
                      className={`btn btn-sm ${pageNo === i ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={(pageNo + 1) * pageSize >= totalElements}
                  onClick={() => setPageNo(p => p + 1)}
                  className="btn btn-outline btn-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="modal-content bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Employee</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}? This action cannot be undone.
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

export default Employees;
