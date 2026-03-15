import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

const VideoPlayer = ({ lesson, isOpen, onClose }) => {
  if (!isOpen || !lesson) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-5xl bg-black border border-neonCyan neon-box-cyan flex flex-col h-[80vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-neonCyan/30 bg-deepBlue/50">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-neonCyan" />
              <h3 className="text-neonCyan font-mono tracking-widest text-lg md:text-xl">SECURE_STREAM // {lesson.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video Placeholder or iframe */}
          <div className="flex-grow relative bg-black flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-matrix-pattern opacity-10 pointer-events-none" />
            
            {lesson.videoUrl ? (
              <video 
                controls 
                className="w-full h-full object-contain filter contrast-125"
                src={lesson.videoUrl}
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 border-4 border border-t-neonCyan rounded-full animate-spin mx-auto mb-4 opacity-50" />
                <p className="font-mono text-neonCyan glitch" data-text="DECRYPTING_VIDEO_STREAM...">DECRYPTING_VIDEO_STREAM...</p>
              </div>
            )}
            
            {/* Scanline overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10" />
          </div>

          {/* Footer Metadata */}
          <div className="p-4 border-t border-neonCyan/30 bg-deepBlue/50 font-mono text-xs text-gray-400 flex justify-between">
            <span>ENCRYPTION: AES-256</span>
            <span>CONNECTION: SECURE</span>
            <span className="text-green-500 hidden md:block">IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.XXX</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoPlayer;
