import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [terminalText, setTerminalText] = useState([]);
  const navigate = useNavigate();

  const bootSequence = [
    'Initializing ALPHA kernel...',
    'Bypassing mainframe security...',
    'Decrypting user protocols...',
    'Establishing secure connection...',
    'System ready.'
  ];

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(Math.floor(currentProgress));

      const step = Math.floor((currentProgress / 100) * bootSequence.length);
      if (step > 0 && step <= bootSequence.length) {
        setTerminalText(bootSequence.slice(0, step));
      }

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/access');
        }, 1000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonCyan to-electricRed glitch" data-text="ALPHA CYBER SECURITY">
          ALPHA CYBER SECURITY
        </h1>
      </motion.div>

      <div className="w-full max-w-2xl mt-8">
        <div className="h-4 bg-deepBlue neon-box-cyan rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-neonCyan shadow-[0_0_10px_#00f0ff]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.3 }}
          />
        </div>
        <div className="text-right mt-2 text-neonCyan font-mono">
          {progress}%
        </div>
      </div>

      <div className="mt-8 text-left w-full max-w-2xl font-mono text-sm h-32 text-gray-400">
        {terminalText.map((text, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-green-500">&gt; </span>{text}
          </motion.div>
        ))}
        {progress < 100 && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <span className="text-neonCyan">&gt; _</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
