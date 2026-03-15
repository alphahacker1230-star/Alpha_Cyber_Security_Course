  import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseService } from '../services/CourseData';
import { Shield, Plus, Edit, Trash2, Video, Database, Save, X } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Basic security check
  const isAuth = localStorage.getItem('admin_auth') === 'true';

  useEffect(() => {
    if (isAuth) {
      setCourses(courseService.getCourses());
    }
  }, [isAuth]);

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (editingCourse.id) {
      courseService.updateCourse(editingCourse);
    } else {
      courseService.addCourse(editingCourse);
    }
    setCourses(courseService.getCourses());
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if(window.confirm('Delete this module? This action cannot be reversed.')){
      courseService.deleteCourse(id);
      setCourses(courseService.getCourses());
    }
  };

  const openEditModal = (course = { title: '', description: '', thumbnail: '', dangerImage: '', detailedExplanation: '', lessons: [] }) => {
    setEditingCourse({ ...course });
  };

  return (
    <div className="min-h-screen bg-black/90 p-4 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto mt-8">
        
        <header className="flex justify-between items-center border-b border-neonCyan/30 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-electricRed" />
            <h1 className="text-2xl font-bold text-electricRed tracking-widest uppercase">SYSOPS_DASHBOARD</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-electricRed transition-colors text-sm border border-transparent hover:border-electricRed p-2"
          >
            TERMINATE_SESSION
          </button>
        </header>

        <div className="flex justify-between mb-6">
          <h2 className="text-xl text-neonCyan flex items-center gap-2">
            <Database className="w-5 h-5"/> ASSET_REGISTRY
          </h2>
          <button 
            onClick={() => openEditModal()}
            className="bg-deepBlue border border-neonCyan text-neonCyan px-4 py-2 flex items-center gap-2 hover:bg-neonCyan hover:text-black transition-colors"
          >
            <Plus className="w-4 h-4"/> ADD_MODULE
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courses.map(course => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-deepBlue/40 border border-gray-800 p-4 flex justify-between items-center hover:border-neonCyan/50 transition-colors"
            >
              <div>
                <h3 className="text-white font-bold text-lg">{course.title}</h3>
                <p className="text-gray-500 text-sm truncate max-w-2xl">{course.description}</p>
                <div className="text-xs text-neonCyan mt-2 flex items-center gap-1">
                  <Video className="w-3 h-3"/> {course.lessons?.length || 0} LESSONS
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(course)}
                  className="p-2 text-gray-400 hover:text-neonCyan border border-transparent hover:border-neonCyan transition-all"
                >
                  <Edit className="w-5 h-5"/>
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-2 text-gray-400 hover:text-electricRed border border-transparent hover:border-electricRed transition-all"
                >
                  <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingCourse && (
          <div className="fixed inset-0 z-120 bg-black/90 flex justify-center items-center p-4">
            <div className="bg-black border-2 border-neonCyan neon-box-cyan w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between p-4 border-b border-neonCyan/30">
                <h2 className="text-neonCyan text-xl font-bold uppercase">
                  {editingCourse.id ? 'EDIT_MODULE' : 'NEW_MODULE'}
                </h2>
                <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-6 h-6"/>
                </button>
              </div>
              
              <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
                <div>
                  <label className="block text-neonCyan text-xs mb-1">MODULE_TITLE</label>
                  <input required type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-2 focus:outline-none focus:border-neonCyan" />
                </div>
                <div>
                  <label className="block text-neonCyan text-xs mb-1">SHORT_DESCRIPTION</label>
                  <textarea required value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-2 focus:outline-none focus:border-neonCyan h-20" />
                </div>
                <div>
                  <label className="block text-neonCyan text-xs mb-1">DETAILED_EXPLANATION</label>
                  <textarea required value={editingCourse.detailedExplanation} onChange={e => setEditingCourse({...editingCourse, detailedExplanation: e.target.value})} className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-2 focus:outline-none focus:border-neonCyan h-24" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neonCyan text-xs mb-1">THUMBNAIL_URL</label>
                    <input type="text" value={editingCourse.thumbnail} onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})} className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-2 focus:outline-none focus:border-neonCyan text-xs" />
                  </div>
                  <div>
                    <label className="block text-electricRed text-xs mb-1">DANGER_IMAGE_URL</label>
                    <input type="text" value={editingCourse.dangerImage} onChange={e => setEditingCourse({...editingCourse, dangerImage: e.target.value})} className="w-full bg-deepBlue/50 border border-electricRed/50 text-white p-2 focus:outline-none focus:border-electricRed text-xs" />
                  </div>
                </div>

                {/* Lesson management could go here, keeping simple for demo */}
                <div className="py-4 border-t border-neonCyan/30 mt-6">
                   <p className="text-xs text-gray-500 mb-2">// LESSON URL MANAGEMENT TO BE IMPLEMENTED IN V2</p>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-deepBlue border border-neonCyan text-neonCyan px-6 py-2 hover:bg-neonCyan hover:text-black transition-colors flex items-center gap-2 uppercase tracking-widest font-bold">
                    <Save className="w-4 h-4"/> EXECUTE_SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
