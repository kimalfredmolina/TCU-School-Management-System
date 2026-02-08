import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Building2, GraduationCap, TrendingUp, UserCheck, Award, Calendar } from 'lucide-react';

const STUDENTS_API = 'http://localhost:5000/api/students';
const DEPARTMENTS_API = 'http://localhost:5000/api/departments';
const COURSES_API = 'http://localhost:5000/api/courses';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartments: 0,
    totalCourses: 0,
    byDepartment: [],
    byCourse: [],
    byYearLevel: [],
    byEnrollmentStatus: [],
    coursesPerDepartment: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [studentsRes, departmentsRes, coursesRes] = await Promise.all([
        fetch(STUDENTS_API),
        fetch(DEPARTMENTS_API),
        fetch(COURSES_API)
      ]);

      const studentsData = await studentsRes.json();
      const departmentsData = await departmentsRes.json();
      const coursesData = await coursesRes.json();

      // Handle response format - extract .data if it exists
      const studentsArray = studentsData.data || studentsData || [];
      const departmentsArray = departmentsData.data || departmentsData || [];
      const coursesArray = coursesData.data || coursesData || [];

      setStudents(studentsArray);
      setDepartments(departmentsArray);
      setCourses(coursesArray);
      
      calculateStats(studentsArray, departmentsArray, coursesArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (studentData, departmentData, courseData) => {
    // Total counts
    const totalStudents = studentData.length;
    const totalDepartments = departmentData.length;
    const totalCourses = courseData.length;

    const departmentLookup = {
      byId: {},
      byCode: {},
      byName: {}
    };
    departmentData.forEach((dept) => {
      if (dept._id) departmentLookup.byId[dept._id] = dept;
      if (dept.code) departmentLookup.byCode[dept.code] = dept;
      if (dept.name) departmentLookup.byName[dept.name] = dept;
    });

    const getDepartmentLabel = (value) => {
      if (!value) return 'Unknown';
      const dept =
        departmentLookup.byId[value] ||
        departmentLookup.byCode[value] ||
        departmentLookup.byName[value];
      if (!dept) return value;
      if (dept.code && dept.name) return `${dept.code} - ${dept.name}`;
      return dept.name || dept.code || value;
    };

    // Group students by department (based on student data)
    const studentCountsByDepartmentId = {};
    studentData.forEach((student) => {
      if (!student.course) return;
      const dept =
        departmentLookup.byId[student.course] ||
        departmentLookup.byCode[student.course] ||
        departmentLookup.byName[student.course];
      if (!dept || !dept._id) return;
      studentCountsByDepartmentId[dept._id] =
        (studentCountsByDepartmentId[dept._id] || 0) + 1;
    });

    const byDepartment = departmentData
      .map((dept) => ({
        department: dept.name,
        code: dept.code,
        count: studentCountsByDepartmentId[dept._id] || 0
      }))
      .sort((a, b) => b.count - a.count);

    // Group by course (from student data)
    const courseGroups = studentData.reduce((acc, student) => {
      const course = getDepartmentLabel(student.course);
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    }, {});
    const byCourse = Object.entries(courseGroups)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 courses

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

    // Courses per department
    const coursesPerDept = {};
    courseData.forEach(course => {
      const deptName = course.department.name;
      const deptCode = course.department.code;
      const key = `${deptCode} - ${deptName}`;
      coursesPerDept[key] = (coursesPerDept[key] || 0) + 1;
    });
    const coursesPerDepartment = Object.entries(coursesPerDept)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      totalStudents,
      totalDepartments,
      totalCourses,
      byDepartment,
      byCourse,
      byYearLevel,
      byEnrollmentStatus,
      coursesPerDepartment
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
          <h1 className="text-4xl font-bold text-blue-950">Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive Student Management System Overview</p>
        </div>

        {/* Main Stats Overview */}
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
            title="Total Departments"
            value={stats.totalDepartments}
            color="bg-green-500"
            subtitle="Active departments"
          />
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.totalCourses}
            color="bg-purple-500"
            subtitle="Available courses"
          />
          <StatCard
            icon={UserCheck}
            title="Regular Students"
            value={stats.byEnrollmentStatus.find(s => s.status === 'Regular')?.count || 0}
            color="bg-orange-500"
            subtitle="Active enrollment"
          />
        </div>

        {/* Department and Course Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Departments with Student Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="w-6 h-6 text-green-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Departments Overview</h2>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                {stats.totalDepartments} Total
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {departments.length > 0 ? (
                departments.map((dept, index) => {
                  const deptStats = stats.byDepartment.find(d => d.code === dept.code) || { count: 0 };
                  return (
                    <div key={dept._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold text-sm">{dept.code}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{dept.name}</p>
                          <p className="text-xs text-gray-500">{dept.head_name || 'No head assigned'}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-semibold text-gray-700">{deptStats.count} students</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No departments available</p>
              )}
            </div>
          </div>

          {/* Courses per Department */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-purple-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Courses per Department</h2>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                {stats.totalCourses} Total
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.coursesPerDepartment.length > 0 ? (
                stats.coursesPerDepartment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.department}</p>
                        <p className="text-sm text-gray-500">{item.count} {item.count === 1 ? 'course' : 'courses'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {((item.count / stats.totalCourses) * 100).toFixed(1)}%
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

        {/* Student Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Students by Course */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <GraduationCap className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Top Student Programs</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.byCourse.length > 0 ? (
                stats.byCourse.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{course.course}</p>
                        <p className="text-sm text-gray-500">{course.count} {course.count === 1 ? 'student' : 'students'}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {((course.count / stats.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No student data available</p>
              )}
            </div>
          </div>

          {/* Year Level Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-indigo-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Students by Year Level</h2>
            </div>
            <div className="space-y-4">
              {stats.byYearLevel.length > 0 ? (
                stats.byYearLevel.map((year, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{year.yearLevel}</span>
                      <span className="text-gray-600 font-semibold">{year.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(year.count / stats.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No year level data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <UserCheck className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Enrollment Status Distribution</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.byEnrollmentStatus.length > 0 ? (
              stats.byEnrollmentStatus.map((status, index) => {
                const statusColors = {
                  'Regular': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600' },
                  'Irregular': { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-600' },
                  'LOA': { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600' },
                  'Graduated': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
                  'Dropped': { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600' }
                };
                const colors = statusColors[status.status] || { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-600' };
                
                return (
                  <div key={index} className={`${colors.light} rounded-lg p-4 text-center`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-white font-bold text-xl">{status.count}</span>
                    </div>
                    <p className={`font-semibold ${colors.text} mb-1`}>{status.status}</p>
                    <p className="text-xs text-gray-500">
                      {((status.count / stats.totalStudents) * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4 col-span-5">No enrollment status data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
