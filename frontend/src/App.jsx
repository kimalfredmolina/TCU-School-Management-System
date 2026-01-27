import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudentList from './pages/StudentList';
import Dashboard from './pages/Dashboard';
import DepartmentList from './pages/DepartmentList';
import CourseList from './pages/CourseList';

function App() {
  const [currentPage, setCurrentPage] = useState('student-list');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <Sidebar 
        activeRoute={currentPage} 
        onNavigate={setCurrentPage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'student-list' && <StudentList />}
        {currentPage === 'department-list' && <DepartmentList />}
        {currentPage === 'course-list' && <CourseList />}
      </div>
    </>
  );
}

export default App;