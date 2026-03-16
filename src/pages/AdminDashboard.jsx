import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService } from '../services/CourseData';
import { Shield, Plus, Edit, Trash2, Video, Database, Save, X, Upload, Image, Film, Eye } from 'lucide-react';

// Reusable Upload Box Component
const UploadBox = ({ label, accept, icon: Icon, onFileSelect, preview, type }) => {
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-neonCyan text-xs font-mono tracking-widest uppercase">{label}</label>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border-2 border-dashed border-neonCyan/40 hover:border-neonCyan hover:bg-neonCyan/5 transition-all cursor-pointer rounded-sm p-6 flex flex-col items-center justify-center gap-3 group min-h-[140px]"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        {preview ? (
          <div className="w-full">
            {type === 'video' ? (
              <video src={preview} className="w-full max-h-32 object-contain rounded" muted />
            ) : (
              <img src={preview} alt="Preview" className="w-full max-h-32 object-contain rounded" />
            )}
            <p className="text-xs text-neonCyan font-mono text-center mt-2 tracking-wider flex items-center justify-center gap-1">
              <Eye className="w-3 h-3" /> PREVIEW_LOADED
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full border border-neonCyan/30 flex items-center justify-center group-hover:border-neonCyan transition-all group-hover:bg-neonCyan/10">
              <Upload className="w-6 h-6 text-neonCyan/60 group-hover:text-neonCyan transition-all group-hover:-translate-y-0.5 duration-200" />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-mono tracking-widest group-hover:text-neonCyan transition-colors">Click to Upload</p>
              <p className="text-gray-600 text-xs font-mono mt-1">{accept.replace(/,/g, ' /')}</p>
            </div>
          </>
        )}
        {/* Corner accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-neonCyan/30 group-hover:border-neonCyan transition-colors" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-neonCyan/30 group-hover:border-neonCyan transition-colors" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-neonCyan/30 group-hover:border-neonCyan transition-colors" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-neonCyan/30 group-hover:border-neonCyan transition-colors" />
      </div>
    </div>
  );
};

// Course Card for admin view
const AdminCourseCard = ({ course, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-deepBlue/40 border border-gray-800 hover:border-neonCyan/50 transition-all group overflow-hidden"
  >
    <div className="relative h-36 overflow-hidden">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full bg-deepBlue/80 flex items-center justify-center">
          <Image className="w-10 h-10 text-gray-700" />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(course)}
          className="p-1.5 bg-black/80 border border-neonCyan/40 text-neonCyan hover:bg-neonCyan hover:text-black transition-all"
          title="Edit"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="p-1.5 bg-black/80 border border-electricRed/40 text-electricRed hover:bg-electricRed hover:text-black transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    <div className="p-3">
      <h3 className="text-white font-bold font-mono text-sm truncate">{course.title}</h3>
      <p className="text-gray-500 text-xs font-mono mt-1 line-clamp-2">{course.description}</p>
      <div className="flex items-center gap-1 mt-2">
        <Video className="w-3 h-3 text-neonCyan" />
        <span className="text-neonCyan text-xs font-mono">{course.lessons?.length || 0} LESSONS</span>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploads, setUploads] = useState({ video: null, thumbnail: null, subjectImage: null });
  const [previews, setPreviews] = useState({ video: null, thumbnail: null, subjectImage: null });

  const isAuth = localStorage.getItem('admin_auth') === 'true';

  useEffect(() => {
    if (isAuth) setCourses(courseService.getCourses());
  }, [isAuth]);

  if (!isAuth) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const handleFileSelect = (field, file) => {
    const url = URL.createObjectURL(file);
    setUploads(prev => ({ ...prev, [field]: file }));
    setPreviews(prev => ({ ...prev, [field]: url }));
    // Keep the video blob URL in state for later use in handleSaveCourse
    if (field === 'video') {
      setEditingCourse(prev => prev ? { ...prev, _videoBlobUrl: url } : prev);
    }
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    // Determine the final video URL: prefer newly uploaded blob, else existing lesson url, else typed url
    const finalVideoUrl = editingCourse._videoBlobUrl
      || editingCourse._videoUrlInput
      || (editingCourse.lessons && editingCourse.lessons[0]?.videoUrl)
      || '';

    // Build updated lessons array — set videoUrl on the first lesson
    let lessons = editingCourse.lessons || [];
    if (finalVideoUrl) {
      if (lessons.length === 0) {
        lessons = [{ id: Date.now(), title: editingCourse.title, videoUrl: finalVideoUrl }];
      } else {
        lessons = lessons.map((l, i) => i === 0 ? { ...l, videoUrl: finalVideoUrl } : l);
      }
    }

    const courseToSave = {
      ...editingCourse,
      thumbnail: previews.thumbnail || editingCourse.thumbnail || '',
      dangerImage: previews.subjectImage || editingCourse.dangerImage || '',
      lessons,
      // Remove internal-only fields
      _videoBlobUrl: undefined,
      _videoUrlInput: undefined,
    };

    if (editingCourse.id) {
      courseService.updateCourse(courseToSave);
    } else {
      courseService.addCourse(courseToSave);
    }
    setCourses(courseService.getCourses());
    setEditingCourse(null);
    setUploads({ video: null, thumbnail: null, subjectImage: null });
    setPreviews({ video: null, thumbnail: null, subjectImage: null });
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Delete this module? This action cannot be reversed.')) {
      courseService.deleteCourse(id);
      setCourses(courseService.getCourses());
    }
  };

  const openEditModal = (course = { title: '', description: '', thumbnail: '', dangerImage: '', detailedExplanation: '', lessons: [] }) => {
    setEditingCourse({ ...course });
    setPreviews({ video: null, thumbnail: course.thumbnail || null, subjectImage: course.dangerImage || null });
  };

  return (
    <div className="min-h-screen bg-black/90 p-4 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto mt-8">

        {/* Header */}
        <header className="flex justify-between items-center border-b border-neonCyan/30 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-electricRed" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-electricRed tracking-widest uppercase">SYSOPS_DASHBOARD</h1>
              <p className="text-gray-600 text-xs tracking-widest">ADMIN_CONTROL_PANEL // SECURE</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-electricRed transition-colors text-xs md:text-sm border border-transparent hover:border-electricRed px-3 py-2"
          >
            TERMINATE_SESSION
          </button>
        </header>

        {/* Course Management Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl text-neonCyan flex items-center gap-2">
            <Database className="w-5 h-5" /> ASSET_REGISTRY
          </h2>
          <button
            onClick={() => openEditModal()}
            className="w-full sm:w-auto bg-deepBlue border border-neonCyan text-neonCyan px-4 py-3 flex items-center justify-center gap-2 hover:bg-neonCyan hover:text-black transition-colors font-bold tracking-widest text-sm"
          >
            <Plus className="w-4 h-4" /> ADD_MODULE
          </button>
        </div>

        {/* Course cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {courses.map(course => (
              <AdminCourseCard
                key={course.id}
                course={course}
                onEdit={openEditModal}
                onDelete={handleDeleteCourse}
              />
            ))}
          </AnimatePresence>
          {courses.length === 0 && (
            <div className="col-span-full text-center text-gray-600 font-mono py-16 border border-dashed border-gray-800">
              NO_MODULES_FOUND // ADD_NEW_MODULE_TO_BEGIN
            </div>
          )}
        </div>

        {/* Edit / Add Modal */}
        <AnimatePresence>
          {editingCourse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex justify-center items-start md:items-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-black border-2 border-neonCyan w-full max-w-4xl my-4"
              >
                {/* Modal Header */}
                <div className="flex justify-between p-4 border-b border-neonCyan/30 bg-deepBlue/30">
                  <h2 className="text-neonCyan text-lg font-bold uppercase tracking-widest">
                    {editingCourse.id ? '// EDIT_MODULE' : '// NEW_MODULE'}
                  </h2>
                  <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-electricRed transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSaveCourse} className="p-4 md:p-6">
                  {/* Text fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-neonCyan text-xs mb-1 tracking-widest uppercase">MODULE_TITLE</label>
                      <input
                        required
                        type="text"
                        value={editingCourse.title}
                        onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-3 focus:outline-none focus:border-neonCyan text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neonCyan text-xs mb-1 tracking-widest uppercase">SHORT_DESCRIPTION</label>
                      <input
                        required
                        type="text"
                        value={editingCourse.description}
                        onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                        className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-3 focus:outline-none focus:border-neonCyan text-sm"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-neonCyan text-xs mb-1 tracking-widest uppercase">DETAILED_EXPLANATION</label>
                    <textarea
                      required
                      value={editingCourse.detailedExplanation}
                      onChange={e => setEditingCourse({ ...editingCourse, detailedExplanation: e.target.value })}
                      className="w-full bg-deepBlue/50 border border-neonCyan/50 text-white p-3 focus:outline-none focus:border-neonCyan h-20 text-sm resize-none"
                    />
                  </div>

                  {/* Upload section */}
                  <div className="border-t border-neonCyan/20 pt-6 mb-6">
                    <h3 className="text-neonCyan text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                      <Film className="w-4 h-4" /> MEDIA_UPLOAD_SYSTEM
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <UploadBox
                        label="COURSE_VIDEO"
                        accept=".mp4,.webm,video/mp4,video/webm"
                        icon={Film}
                        onFileSelect={(f) => handleFileSelect('video', f)}
                        preview={previews.video}
                        type="video"
                      />
                      <UploadBox
                        label="THUMBNAIL"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        icon={Image}
                        onFileSelect={(f) => handleFileSelect('thumbnail', f)}
                        preview={previews.thumbnail}
                        type="image"
                      />
                      <UploadBox
                        label="SUBJECT_IMAGE"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        icon={Image}
                        onFileSelect={(f) => handleFileSelect('subjectImage', f)}
                        preview={previews.subjectImage}
                        type="image"
                      />
                    </div>

                    {/* Fallback: paste a direct video URL */}
                    <div className="mt-4">
                      <label className="block text-gray-500 text-xs mb-1 tracking-widest uppercase font-mono">
                        — OR PASTE VIDEO URL (MP4 / WebM)
                      </label>
                      <input
                        type="url"
                        value={editingCourse._videoUrlInput || editingCourse.lessons?.[0]?.videoUrl || ''}
                        onChange={e => setEditingCourse({ ...editingCourse, _videoUrlInput: e.target.value })}
                        className="w-full bg-deepBlue/50 border border-gray-700 text-white p-2.5 focus:outline-none focus:border-neonCyan text-xs font-mono placeholder-gray-600"
                        placeholder="https://example.com/video.mp4"
                      />
                      {(editingCourse._videoUrlInput || editingCourse.lessons?.[0]?.videoUrl) && !previews.video && (
                        <p className="text-neonCyan text-[10px] font-mono mt-1 tracking-wider">
                          ✓ VIDEO_URL_SET
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-neonCyan/20">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-colors uppercase tracking-widest text-sm"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="bg-deepBlue border border-neonCyan text-neonCyan px-8 py-3 hover:bg-neonCyan hover:text-black transition-colors flex items-center justify-center gap-2 uppercase tracking-widest font-bold text-sm"
                    >
                      <Save className="w-4 h-4" /> EXECUTE_SAVE
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
