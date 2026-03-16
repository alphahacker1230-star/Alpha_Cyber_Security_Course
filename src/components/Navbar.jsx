import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Terminal, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    localStorage.removeItem('access_granted');
    navigate('/login');
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
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 py-2 transition-colors cursor-pointer focus:outline-none bg-transparent border-none"
            >
              <LogOut className="w-4 h-4" />
              <span>ABORT</span>
            </button>
          </div>

          {/* User Info & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2 border border-neonCyan/30 bg-black/50 px-3 py-1.5 rounded-sm">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" className="w-6 h-6 rounded-full border border-neonCyan" />
                ) : (
                  <User className="w-5 h-5 text-neonCyan" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs text-neonCyan font-bold truncate max-w-[100px]">{user.user_metadata?.full_name || 'OPERATIVE'}</span>
                </div>
              </div>
            )}
            
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
              <button 
                onClick={(e) => { handleLogout(e); closeMobileMenu(); }}
                className="w-full flex items-center gap-3 p-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer bg-transparent border-none text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg">ABORT</span>
              </button>
            </div>
            
            {user && (
              <div className="px-4 pb-4 pt-2 border-t border-neonCyan/20">
                <div className="flex items-center gap-3 text-gray-400">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="avatar" className="w-8 h-8 rounded-full border border-neonCyan" />
                  ) : (
                    <User className="w-8 h-8 text-neonCyan" />
                  )}
                  <div>
                    <div className="text-sm text-neonCyan font-bold">{user.user_metadata?.full_name || 'OPERATIVE'}</div>
                    <div className="text-xs">{user.email}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
