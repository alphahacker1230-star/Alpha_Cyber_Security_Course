import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Terminal, Settings, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_granted');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/course" 
              className={`flex items-center gap-2 transition-colors hover:text-neonCyan py-2 ${location.pathname === '/course' ? 'text-neonCyan border-b-2 border-neonCyan' : 'text-gray-400'}`}
            >
              <Terminal className="w-4 h-4" />
              <span>TERMINAL</span>
            </Link>
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 transition-colors hover:text-electricRed py-2 ${location.pathname.startsWith('/admin') ? 'text-electricRed border-b-2 border-electricRed' : 'text-gray-400'}`}
            >
              <Settings className="w-4 h-4" />
              <span>SYSTEM_CONFIG</span>
            </Link>
            <Link 
              to="/access" 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 py-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ABORT</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neonCyan hover:text-electricRed p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-black/95 border-b border-neonCyan/30"
          >
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/course" 
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 p-3 transition-colors ${location.pathname === '/course' ? 'text-neonCyan bg-neonCyan/10 border-l-2 border-neonCyan' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Terminal className="w-5 h-5" />
                <span className="text-lg">TERMINAL</span>
              </Link>
              <Link 
                to="/admin" 
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 p-3 transition-colors ${location.pathname.startsWith('/admin') ? 'text-electricRed bg-electricRed/10 border-l-2 border-electricRed' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-lg">SYSTEM_CONFIG</span>
              </Link>
              <Link 
                to="/access" 
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                className="flex items-center gap-3 p-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg">ABORT</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
