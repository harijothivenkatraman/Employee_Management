import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import { employeeAPI } from '../api/axios';
import { 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineCalculator, HiOutlineCash } from 'react-icons/hi';

const chartColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll({ pageNo: 0, pageSize: 200 });
      const data = response.data.content || response.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const count = employees.length;
    const salaries = employees.map(e => e.salary || 0).sort((a, b) => a - b);
    const totalPayroll = salaries.reduce((a, b) => a + b, 0);
    const avgSalary = count > 0 ? totalPayroll / count : 0;
    
    let medianSalary = 0;
    if (count > 0) {
      const mid = Math.floor(count / 2);
      medianSalary = count % 2 !== 0 ? salaries[mid] : (salaries[mid - 1] + salaries[mid]) / 2;
    }

    return { count, totalPayroll, avgSalary, medianSalary };
  }, [employees]);

  // Chart Data Calculations
  const deptData = useMemo(() => {
    const grouped = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const salaryDistData = useMemo(() => {
    const ranges = { '0-50k': 0, '50k-75k': 0, '75k-100k': 0, '100k+': 0 };
    employees.forEach(emp => {
      const s = emp.salary || 0;
      if (s < 50000) ranges['0-50k']++;
      else if (s < 75000) ranges['50k-75k']++;
      else if (s < 100000) ranges['75k-100k']++;
      else ranges['100k+']++;
    });
    return Object.entries(ranges).map(([name, count]) => ({ name, count }));
  }, [employees]);

  const deptSalaryData = useMemo(() => {
    const grouped = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      if (!acc[dept]) acc[dept] = { total: 0, count: 0 };
      acc[dept].total += (emp.salary || 0);
      acc[dept].count += 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, data]) => ({
      name,
      avgSalary: Math.round(data.total / data.count)
    }));
  }, [employees]);

  const headcountTrendData = useMemo(() => {
    // Mock data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let current = Math.max(10, employees.length - 20); // Start with some base
    return months.map((month, i) => {
      // Last month is the actual current headcount if there are employees, else simulate
      const count = i === 5 && employees.length > 0 ? employees.length : current + Math.floor(Math.random() * 5);
      current = count;
      return { name: month, count };
    });
  }, [employees]);

  if (loading) {
    return (
      <div className="animate-fade-in p-6">
        <Header title="Reports" subtitle="Analytics and insights" />
        <div className="text-center py-12 text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6">
      <Header title="Reports" subtitle="Analytics and insights" />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <HiOutlineUserGroup className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Headcount</p>
            <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <HiOutlineCurrencyDollar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Average Salary</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <HiOutlineCalculator className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Median Salary</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.medianSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <HiOutlineCash className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Payroll</p>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalPayroll.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees by Dept */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Employees by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Employees']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Salary Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Salary Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Department Salary Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSalaryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} 
                       tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Avg Salary']} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="avgSalary" fill="#10b981" radius={[4, 4, 0, 0]} name="Avg Salary">
                  {deptSalaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Headcount Trend (6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" name="Headcount" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
