import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeAPI } from '../api/axios';
import Header from '../components/layout/Header';
import toast from 'react-hot-toast';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    salary: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeAPI.getById(id);
        const emp = response.data;
        setFormData({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          department: emp.department || '',
          salary: emp.salary || ''
        });
      } catch (error) {
        toast.error('Failed to fetch employee details');
        navigate('/employees');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await employeeAPI.update(id, {
        ...formData,
        salary: Number(formData.salary)
      });
      toast.success('Employee updated successfully');
      navigate('/employees');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="animate-pulse pb-8">
        <div className="h-24 bg-gray-200 w-full mb-6"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-8">
      <Header title="Edit Employee" subtitle="Update employee information" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="glass-card bg-white p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="form-label block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input w-full ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="form-label block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input w-full ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="form-label block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label block mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  className={`form-input w-full ${errors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="form-label block mb-1">Salary ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  className={`form-input w-full ${errors.salary ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={formData.salary}
                  onChange={handleChange}
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/employees')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
