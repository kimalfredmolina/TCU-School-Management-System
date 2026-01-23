import React, { useState } from 'react';
import { Home, Users, Building2, BookOpen, LogOut, Menu, X, Moon, Sun } from 'lucide-react';

const Sidebar = ({ activeRoute = 'student-list', onNavigate, isCollapsed, setIsCollapsed }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'student-list', label: 'Student List', icon: Users },
    { id: 'department-list', label: 'Department List', icon: Building2 },
    { id: 'course-list', label: 'Course List', icon: BookOpen },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // dark mode toggle logic here later
    document.documentElement.classList.toggle('dark');
  };

  const handleNavigation = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // logic for logout later here
      console.log('Logging out...');
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xl font-bold">Student Records</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-800 transition"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 w-full border-t border-gray-700">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-4 px-4 py-3 text-gray-300 hover:bg-gray-800 transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-800 transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;