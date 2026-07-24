import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineInformationCircle } from 'react-icons/hi';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const username = user?.username || 'user';
  const initials = username.substring(0, 2).toUpperCase();
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    // Placeholder
  };

  return (
    <div className="animate-fade-in p-6">
      <Header title="Profile" subtitle="Your account information" />
      
      <div className="max-w-2xl mx-auto mt-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header section with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-12 flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700">
                  {initials}
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
              <div className="mt-2">
                <span className={`badge ${isAdmin ? 'badge-primary' : 'badge-success'} px-3 py-1 text-sm rounded-full inline-block`}>
                  {isAdmin ? 'ADMIN' : 'EMPLOYEE'}
                </span>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label text-sm text-gray-600 mb-1 block">Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    readOnly 
                    className="form-input w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed rounded-lg px-4 py-2 border focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="form-label text-sm text-gray-600 mb-1 block">Role</label>
                  <input 
                    type="text" 
                    value={isAdmin ? 'Administrator' : 'Standard User'} 
                    readOnly 
                    className="form-input w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed rounded-lg px-4 py-2 border focus:outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label text-sm text-gray-600 mb-1 block">Member Since</label>
                  <input 
                    type="text" 
                    value={today} 
                    readOnly 
                    className="form-input w-full bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed rounded-lg px-4 py-2 border focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="mt-10 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Change Password</h3>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-700 text-sm mb-4">
                <HiOutlineInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Password change is not yet implemented in this demo version.</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="form-label text-sm text-gray-600 mb-1 block">Current Password</label>
                  <input 
                    type="password" 
                    name="current"
                    value={passwords.current}
                    onChange={handleChange}
                    className="form-input w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label text-sm text-gray-600 mb-1 block">New Password</label>
                    <input 
                      type="password" 
                      name="new"
                      value={passwords.new}
                      onChange={handleChange}
                      className="form-input w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="form-label text-sm text-gray-600 mb-1 block">Confirm Password</label>
                    <input 
                      type="password" 
                      name="confirm"
                      value={passwords.confirm}
                      onChange={handleChange}
                      className="form-input w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled
                    className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium opacity-50 cursor-not-allowed"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
