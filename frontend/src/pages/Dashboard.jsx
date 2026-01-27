import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Building2, GraduationCap, TrendingUp, UserCheck } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/students';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    byDepartment: [],
    byCourse: [],
    byYearLevel: [],
    byEnrollmentStatus: []
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentData) => {
    // Total students
    const totalStudents = studentData.length;

    // Group by course
    const courseGroups = studentData.reduce((acc, student) => {
      const course = student.course || 'Unknown';
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    }, {});
    const byCourse = Object.entries(courseGroups)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count);

    // Extract departments from courses (assuming format like "BS in Computer Science" -> "Computer Science")
    const departmentGroups = studentData.reduce((acc, student) => {
      const course = student.course || 'Unknown';
      // Extract department name (remove degree prefix like BS, BA, etc.)
      const department = course.replace(/^(BS|BA|BSBA|AB|BSN|BSED|BEED)\s*(in\s*)?/i, '').trim() || course;
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});
    const byDepartment = Object.entries(departmentGroups)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    // Group by year level
    const yearLevelGroups = studentData.reduce((acc, student) => {
      const yearLevel = student.year_level || 'Unknown';
      acc[yearLevel] = (acc[yearLevel] || 0) + 1;
      return acc;
    }, {});
    const byYearLevel = Object.entries(yearLevelGroups)
      .map(([yearLevel, count]) => ({ yearLevel, count }))
      .sort((a, b) => {
        const order = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
        return order.indexOf(a.yearLevel) - order.indexOf(b.yearLevel);
      });

    // Group by enrollment status
    const statusGroups = studentData.reduce((acc, student) => {
      const status = student.enrollment_status || 'Regular';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const byEnrollmentStatus = Object.entries(statusGroups)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      totalStudents,
      byDepartment,
      byCourse,
      byYearLevel,
      byEnrollmentStatus
    });
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Student Management System Overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="bg-blue-500"
            subtitle="Enrolled students"
          />
          <StatCard
            icon={Building2}
            title="Departments"
            value={stats.byDepartment.length}
            color="bg-green-500"
            subtitle="Active departments"
          />
          <StatCard
            icon={BookOpen}
            title="Courses"
            value={stats.byCourse.length}
            color="bg-purple-500"
            subtitle="Available programs"
          />
          <StatCard
            icon={UserCheck}
            title="Regular Students"
            value={stats.byEnrollmentStatus.find(s => s.status === 'Regular')?.count || 0}
            color="bg-orange-500"
            subtitle="Active enrollment"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Department List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Building2 className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Students by Department</h2>
            </div>
            <div className="space-y-3">
              {stats.byDepartment.length > 0 ? (
                stats.byDepartment.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{dept.department}</p>
                        <p className="text-sm text-gray-500">{dept.count} {dept.count === 1 ? 'student' : 'students'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {((dept.count / stats.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No department data available</p>
              )}
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Students by Course</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.byCourse.length > 0 ? (
                stats.byCourse.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{course.course}</p>
                        <p className="text-sm text-gray-500">{course.count} {course.count === 1 ? 'student' : 'students'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {((course.count / stats.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No course data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Year Level and Enrollment Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Year Level Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Students by Year Level</h2>
            </div>
            <div className="space-y-3">
              {stats.byYearLevel.length > 0 ? (
                stats.byYearLevel.map((year, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="font-medium text-gray-800 w-24">{year.yearLevel}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(year.count / stats.totalStudents) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-gray-600 font-semibold w-16 text-right">{year.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No year level data available</p>
              )}
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <UserCheck className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Enrollment Status</h2>
            </div>
            <div className="space-y-3">
              {stats.byEnrollmentStatus.length > 0 ? (
                stats.byEnrollmentStatus.map((status, index) => {
                  const statusColors = {
                    'Regular': 'bg-green-500',
                    'Irregular': 'bg-yellow-500',
                    'LOA': 'bg-orange-500',
                    'Graduated': 'bg-blue-500',
                    'Dropped': 'bg-red-500'
                  };
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center flex-1">
                        <span className="font-medium text-gray-800 w-24">{status.status}</span>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${statusColors[status.status] || 'bg-gray-500'} h-2 rounded-full transition-all`}
                              style={{ width: `${(status.count / stats.totalStudents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-600 font-semibold w-16 text-right">{status.count}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No enrollment status data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;