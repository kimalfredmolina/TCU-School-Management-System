import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StudentList from './pages/StudentList';

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
        {currentPage === 'student-list' && <StudentList />}
      </div>
    </>
  );
}

export default App;