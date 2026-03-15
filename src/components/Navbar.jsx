import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Terminal, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const handleLogout = () => {
    // Basic logout handling if needed
    localStorage.removeItem('access_granted');
  };

  return (
    <nav className="border-b border-neonCyan/30 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/course" className="flex items-center gap-2 group">
              <Shield className="w-8 h-8 text-neonCyan group-hover:text-electricRed transition-colors" />
              <span className="font-bold text-xl tracking-wider text-white group-hover:neon-text-cyan transition-shadow">
                ALPHA<span className="text-electricRed">_</span>CYBER
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link 
              to="/course" 
              className={`flex items-center gap-2 transition-colors hover:text-neonCyan ${location.pathname === '/course' ? 'text-neonCyan border-b-2 border-neonCyan' : 'text-gray-400'}`}
            >
              <Terminal className="w-4 h-4" />
              <span>TERMINAL</span>
            </Link>
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 transition-colors hover:text-electricRed ${location.pathname.startsWith('/admin') ? 'text-electricRed border-b-2 border-electricRed' : 'text-gray-400'}`}
            >
              <Settings className="w-4 h-4" />
              <span>SYSTEM_CONFIG</span>
            </Link>
            <Link 
              to="/access" 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ABORT</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
