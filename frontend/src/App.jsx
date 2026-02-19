import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import StudentList from './pages/StudentList';
import Dashboard from './pages/Dashboard';
import DepartmentList from './pages/DepartmentList';
import CourseList from './pages/CourseList';
import Login from './authentication/Login';

function App() {
  const routeToPage = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'dashboard';
      case '/students':
        return 'student-list';
      case '/departments':
        return 'department-list';
      case '/courses':
        return 'course-list';
      case '/login':
        return 'login';
      case '/':
      default:
        return 'dashboard';
    }
  };

  const pageToRoute = {
    'dashboard': '/dashboard',
    'student-list': '/students',
    'department-list': '/departments',
    'course-list': '/courses',
  };

  const [currentPage, setCurrentPage] = useState(() => routeToPage(window.location.pathname));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/auth/me", {
          credentials: "include",
        });
        if (!cancelled) {
          if (response.ok) {
            const user = await response.json();
            setIsAuthenticated(Boolean(user));
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(routeToPage(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    const nextPath = pageToRoute.dashboard;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    const nextPath = pageToRoute[page] || '/dashboard';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  // LOGIN PAGE
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // MAIN PAGES
  return (
    <>
      <Sidebar 
        activeRoute={currentPage} 
        onNavigate={handleNavigate}
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