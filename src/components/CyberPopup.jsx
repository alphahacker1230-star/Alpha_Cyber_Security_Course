import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Play } from 'lucide-react';

const CyberPopup = ({ course, isOpen, onClose, onStart }) => {
  if (!isOpen || !course) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-[95%] md:w-full max-w-2xl max-h-[90vh] flex flex-col bg-black border-2 border-electricRed neon-box-red overflow-hidden"
        >
          {/* Danger Striping Top */}
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#ff003c,#ff003c_10px,#000_10px,#000_20px)]" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-electricRed hover:animate-pulse z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-0 md:p-1 overflow-y-auto flex-1 custom-scrollbar">
            <div className="relative h-64 w-full overflow-hidden border-b border-electricRed/30">
              <img 
                src={course.dangerImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'} 
                alt="Danger Awareness"
                className="w-full h-full object-cover opacity-80 mix-blend-screen filter sepia hue-rotate-300" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-electricRed animate-pulse" />
                <h2 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-500 to-electricRed glitch" data-text="WARNING: CRITICAL TOPIC">
                  WARNING: CRITICAL TOPIC
                </h2>
              </div>
            </div>

            <div className="p-4 md:p-6 bg-deepBlue/50">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{course.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed font-mono text-sm">
                {course.detailedExplanation || course.description}
                <br /><br />
                <span className="text-electricRed">DANGER AWARENESS:</span> Unauthorized use of these techniques is strictly prohibited and illegal. This training is for defensive purposes only.
              </p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => onStart(course)}
                  className="group relative px-6 py-3 bg-black border border-electricRed text-electricRed font-bold hover:bg-electricRed hover:text-black transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span className="text-sm md:text-base">INITIALIZE_LESSON</span>
                  <div className="absolute inset-0 bg-electricRed opacity-0 group-hover:opacity-20 animate-pulse" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Danger Striping Bottom */}
          <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#ff003c,#ff003c_10px,#000_10px,#000_20px)]" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CyberPopup;
