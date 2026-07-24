import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import { employeeAPI } from '../api/axios';
import { 
  HiOutlineUsers, 
  HiOutlineOfficeBuilding, 
  HiOutlineCurrencyDollar, 
  HiOutlineUserAdd 
} from 'react-icons/hi';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentsCount: 0,
    averageSalary: 0,
    newThisMonth: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll({ pageNo: 0, pageSize: 100 });
      const data = response.data?.content || [];
      
      setEmployees(data);
      
      // Calculate stats
      const total = data.length;
      
      const departments = new Set(data.map(emp => emp.department).filter(Boolean));
      const deptCount = departments.size;
      
      const totalSalary = data.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
      const avgSalary = total > 0 ? (totalSalary / total) : 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newEmployees = data.filter(emp => {
        const dateValue = emp.joiningDate || emp.createdAt;
        if (!dateValue) return false;
        const date = new Date(dateValue);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;
      
      setStats({
        totalEmployees: total,
        departmentsCount: deptCount,
        averageSalary: avgSalary,
        newThisMonth: newEmployees
      });

      // Prepare Chart Data: Employees by Department
      const deptMap = {};
      data.forEach(emp => {
        const dept = emp.department || 'Unassigned';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });
      const pieData = Object.keys(deptMap).map(key => ({
        name: key,
        value: deptMap[key]
      }));
      setDepartmentData(pieData);

      // Prepare Chart Data: Salary Distribution (by department)
      const salaryMap = {};
      const deptCountMap = {};
      data.forEach(emp => {
        const dept = emp.department || 'Unassigned';
        salaryMap[dept] = (salaryMap[dept] || 0) + (Number(emp.salary) || 0);
        deptCountMap[dept] = (deptCountMap[dept] || 0) + 1;
      });
      const barData = Object.keys(salaryMap).map(key => ({
        name: key,
        avgSalary: Math.round(salaryMap[key] / deptCountMap[key])
      }));
      setSalaryData(barData);

    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getGradientForAvatar = (index) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-emerald-400 to-emerald-600',
      'from-amber-400 to-amber-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600'
    ];
    return gradients[index % gradients.length];
  };

  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-8 bg-slate-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="mt-4 h-3 bg-slate-200 rounded w-32"></div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-10">
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.username || 'Admin'}`} 
      />

      <div className="px-4 sm:px-6 lg:px-8 mt-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="stat-card primary bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Employees</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.totalEmployees}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <HiOutlineUsers size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 flex items-center">
                  <span className="text-emerald-500 font-medium mr-1">+12%</span> from last month
                </p>
              </div>

              <div className="stat-card success bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Departments</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.departmentsCount}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                    <HiOutlineOfficeBuilding size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 flex items-center">
                  <span className="text-emerald-500 font-medium mr-1">+0%</span> from last month
                </p>
              </div>

              <div className="stat-card warning bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Avg Salary</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(stats.averageSalary)}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                    <HiOutlineCurrencyDollar size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 flex items-center">
                  <span className="text-emerald-500 font-medium mr-1">+4.2%</span> from last month
                </p>
              </div>

              <div className="stat-card danger bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">New This Month</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.newThisMonth}</h3>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-600">
                    <HiOutlineUserAdd size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 flex items-center">
                  <span className="text-emerald-500 font-medium mr-1">+2</span> since last week
                </p>
              </div>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Employees by Department</h3>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin"></div>
              </div>
            ) : departmentData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Avg Salary by Department</h3>
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
              </div>
            ) : salaryData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Avg Salary']}
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="avgSalary" radius={[4, 4, 0, 0]}>
                      {salaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>
        </div>

        {/* Recent Employees Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Recent Employees</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                          <div className="ml-4 space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-20 bg-slate-200 rounded-full"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                    </tr>
                  ))
                ) : employees.length > 0 ? (
                  employees.slice(0, 5).map((emp, index) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white font-medium bg-gradient-to-br ${getGradientForAvatar(index)} shadow-inner`}>
                            {getInitials(`${emp.firstName} ${emp.lastName}`)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{emp.firstName} {emp.lastName}</div>
                            <div className="text-sm text-slate-500">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {emp.department || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                        {formatCurrency(emp.salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(emp.createdAt || new Date()).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
