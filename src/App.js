import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [displayData, setDisplayData] = useState(null);
  const [nodeName, setNodeName] = useState('Unknown');

  const apiUrl = 'http://54.152.132.206'; // Replace with your EC2 API URL

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/students`);
      console.log("Raw /students response:", response.data);
      setStudents(response.data);
      setDisplayData('students');
    } catch (error) {
      console.error('Error fetching students:', error);
      setDisplayData('error-students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/subjects`);
      console.log("Raw /subjects response:", response.data);

      // **DEFINITIVE CORRECTED FILTERING BASED ON YOUR API OUTPUT**
      const softwareEngCourses = response.data.filter(subject => {
        return subject.year >= 1 && subject.year <= 4; //  <--  SIMPLIFIED FILTERING!
      });

      console.log("Filtered courses:", softwareEngCourses);
      setCourses(softwareEngCourses);
      setDisplayData('courses');
    } catch (error) {
      console.error('Error fetching courses:', error);
      setDisplayData('error-courses');
    }
  };

  useEffect(() => {
    const nodeId = process.env.REACT_APP_NODE_ID;
    if (nodeId) {
      setNodeName(nodeId);
    } else {
      console.warn("REACT_APP_NODE_ID environment variable not set.");
    }
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Welcome to the UDOM Student and subject App</h1>
      </header>
      <main>
        <button onClick={fetchStudents} className="student-button">Students</button>
        <button onClick={fetchCourses} className="course-button">Courses</button>

        {displayData === 'students' && (
          <div id="data-display">
            <h2>Students</h2>
            <ul>
              {students.map(student => (
                <li key={student.id}>
                  <span className="name">{student.name}</span> -
                  <span className="program">{student.program}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {displayData === 'courses' && (
          <div id="data-display">
            <h2>Courses</h2>  {/* Corrected Heading */}
            <ul>
              {courses.map(course => {
                console.log("Individual course object:", course);
                return (
                  <li key={course.id}>
                    <span className="subject">{course.subject_name}</span> (Year {course.year})
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {displayData === 'error-students' && (
          <p className="error-message">Failed to load students. Please check your API connection.</p>
        )}

        {displayData === 'error-courses' && (
          <p className="error-message">Failed to load courses. Please check your API connection.</p>
        )}

        <div id="node-indicator">
          <p>Responding Node: {nodeName}</p>
        </div>
      </main>
    </div>
  );
}

export default App;