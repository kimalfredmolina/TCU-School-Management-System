import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudentList from './pages/StudentList';
import Dashboard from './pages/Dashboard';
import DepartmentList from './pages/DepartmentList';
import CourseList from './pages/CourseList';
import Login from './authentication/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  // LOGIN PAGE
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // MAIN PAGES
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