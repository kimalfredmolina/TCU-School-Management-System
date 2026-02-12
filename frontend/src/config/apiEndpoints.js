const BASE_URL = 'http://localhost:5001/api';

export const API = {
  STUDENTS: `${BASE_URL}/students`,
  DEPARTMENTS: `${BASE_URL}/departments`,
  COURSES: `${BASE_URL}/courses`,
};

// Example usage in components:
export const STUDENTS_API = API.STUDENTS;
export const DEPARTMENTS_API = API.DEPARTMENTS;
export const COURSES_API = API.COURSES;

export default API;
