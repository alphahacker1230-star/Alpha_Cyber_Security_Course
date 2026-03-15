import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import CyberPopup from '../components/CyberPopup';
import VideoPlayer from '../components/VideoPlayer';
import { courseService } from '../services/CourseData';

const CourseHome = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    setCourses(courseService.getCourses());
  }, []);

  const hasAccess = localStorage.getItem('access_granted') === 'true';

  if (!hasAccess) {
    return <Navigate to="/access" replace />;
  }

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsPopupOpen(true);
  };

  const handleStartLesson = (course) => {
    setIsPopupOpen(false);
    // Open the first lesson automatically, or show a list of lessons?
    // Let's show the list of lessons in the UI below, but for now we can just open the first one
    if (course.lessons && course.lessons.length > 0) {
      setTimeout(() => {
        setSelectedLesson(course.lessons[0]);
        setIsVideoOpen(true);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto mt-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-l-4 border-neonCyan pl-6 py-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neonCyan mb-4 uppercase tracking-wider">
            ALPHA CYBER SECURITY TRAINING
          </h1>
          <p className="text-gray-400 font-mono max-w-3xl leading-relaxed text-sm md:text-base">
            &gt; SYSTEM_READY. <br/>
            Welcome operative. Engage in elite cyber warfare modules designed to test and forge your tactical digital skills. From basic cryptography to advanced exploitation, complete modules to elevate your clearance level.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard source={course} course={course} onClick={handleCourseClick} />
            </motion.div>
          ))}
        </div>

        <CyberPopup 
          course={selectedCourse}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onStart={handleStartLesson}
        />

        <VideoPlayer 
          lesson={selectedLesson}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
        
      </div>
    </div>
  );
};

export default CourseHome;
