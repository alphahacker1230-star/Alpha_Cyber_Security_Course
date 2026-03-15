import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Mock authentication
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('ACCESS_DENIED: INCORRECT PASSPHRASE');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black border border-electricRed p-8 neon-box-red"
      >
        <div className="text-center mb-8">
          <Terminal className="w-12 h-12 text-electricRed mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-mono text-electricRed tracking-widest">ROOT_ACCESS</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-electricRed font-mono text-xs mb-2">&gt; ENTER_ROOT_PASSPHRASE</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-deepBlue/50 border border-electricRed/50 text-white p-3 font-mono focus:outline-none focus:border-electricRed focus:shadow-[0_0_10px_#ff003c] transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-electricRed font-mono text-xs text-center glitch" data-text={error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black border border-electricRed text-electricRed font-bold font-mono py-3 hover:bg-electricRed hover:text-black transition-all duration-300 uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,60,0.2)] hover:shadow-[0_0_20px_rgba(255,0,60,0.6)]"
          >
            EXECUTE
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
