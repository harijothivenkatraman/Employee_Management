import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import { employeeAPI } from '../api/axios';
import { HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineOfficeBuilding } from 'react-icons/hi';

const chartColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Departments = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll({ pageNo: 0, pageSize: 200 });
      // Depending on API structure, it might be response.data.content or response.data
      const data = response.data.content || response.data || [];
      setEmployees(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load department data');
      setEmployees([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const departmentsData = useMemo(() => {
    if (!employees || employees.length === 0) return [];
    
    const grouped = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(emp);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, emps], index) => {
      const count = emps.length;
      const salaries = emps.map(e => e.salary || 0);
      const avgSalary = count > 0 ? salaries.reduce((a, b) => a + b, 0) / count : 0;
      const minSalary = count > 0 ? Math.min(...salaries) : 0;
      const maxSalary = count > 0 ? Math.max(...salaries) : 0;
      const color = chartColors[index % chartColors.length];

      return {
        name,
        count,
        avgSalary,
        minSalary,
        maxSalary,
        color,
        employees: emps
      };
    });
  }, [employees]);

  const maxDeptCount = Math.max(...departmentsData.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="animate-fade-in p-6">
        <Header title="Departments" subtitle="Organization structure overview" />
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3 mb-4">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-16 w-full bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6">
      <Header title="Departments" subtitle="Organization structure overview" />
      
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
          <span>{error}</span>
          <button onClick={fetchEmployees} className="ml-auto text-sm underline font-medium">Retry</button>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <HiOutlineOfficeBuilding className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Departments</h3>
                <p className="text-xl font-bold text-gray-900">{departmentsData.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentsData.map((dept) => (
              <div 
                key={dept.name} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden transition-all hover:shadow-md"
              >
                {/* Left accent border */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5" 
                  style={{ backgroundColor: dept.color }}
                />
                
                <div className="pl-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{dept.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Employees</p>
                      <div className="flex items-center gap-2">
                        <HiOutlineUserGroup className="text-gray-400" />
                        <span className="font-semibold text-gray-800">{dept.count}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Avg Salary</p>
                      <div className="flex items-center gap-2">
                        <HiOutlineCurrencyDollar className="text-gray-400" />
                        <span className="font-semibold text-gray-800">
                          ${dept.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Salary Range</span>
                      <span>${dept.minSalary.toLocaleString()} - ${dept.maxSalary.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-gray-300 h-1.5 rounded-full" 
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Relative Size</span>
                      <span>{Math.round((dept.count / maxDeptCount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ 
                          width: `${(dept.count / maxDeptCount) * 100}%`,
                          backgroundColor: dept.color 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Team Members</p>
                    <div className="flex flex-wrap gap-2">
                      {dept.employees.slice(0, 5).map(emp => (
                        <span key={emp.id} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                          {emp.firstName} {emp.lastName}
                        </span>
                      ))}
                      {dept.count > 5 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-medium">
                          +{dept.count - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {departmentsData.length === 0 && (
              <div className="col-span-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                No department data found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Departments;
