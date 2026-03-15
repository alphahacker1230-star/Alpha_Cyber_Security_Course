import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const CourseCard = ({ course, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-deepBlue/80 border border-neonCyan/30 p-1 cursor-pointer overflow-hidden rounded-sm hover:neon-box-cyan transition-all"
      onClick={() => onClick(course)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
        {/* Cyber scan line effect on hover */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neonCyan opacity-0 group-hover:opacity-50 group-hover:animate-scan z-20" />
      </div>

      <div className="relative z-20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-neonCyan" />
          <span className="text-xs text-neonCyan font-mono tracking-widest uppercase">MODULE_{course.id}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:neon-text-cyan transition-colors line-clamp-1">{course.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neonCyan" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neonCyan" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neonCyan" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neonCyan" />
    </motion.div>
  );
};

export default CourseCard;
