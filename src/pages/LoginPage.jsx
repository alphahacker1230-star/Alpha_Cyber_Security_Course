import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    setIsLoggingIn(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      setError(error.message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        className="w-full max-w-md bg-black/90 backdrop-blur-md p-8 border-2 border-neonCyan neon-box-cyan relative z-10"
      >
        {/* Corner Accents */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-electricRed" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neonCyan" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neonCyan" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-electricRed" />

        <div className="text-center mb-10">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Shield className="w-16 h-16 text-neonCyan mb-4 filter drop-shadow-[0_0_8px_#00f0ff]" />
          </motion.div>
          
          <h1 className="text-3xl font-black italic glitch text-white uppercase tracking-tighter" data-text="Alpha Cyber Security">
            Alpha Cyber Security
          </h1>
          <p className="text-neonCyan text-sm mt-3 tracking-widest font-bold">
            SECURE CYBER TRAINING PLATFORM
          </p>
          <div className="h-0.5 w-3/4 mx-auto bg-linear-to-r from-transparent via-electricRed to-transparent mt-4 opacity-70" />
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-400 text-xs tracking-[0.2em] mb-4">
              [ AUTHENTICATION_REQUIRED ]
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-sm">SECURE_OAUTH_LINK</span>
            </div>
          </div>

          {error && (
            <div className="bg-electricRed/20 border border-electricRed p-3 text-electricRed text-xs flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>AUTH_ERROR: {error}</p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={loginWithGoogle}
            disabled={isLoggingIn}
            className="w-full bg-white text-black font-bold py-4 px-6 flex items-center justify-center gap-3 uppercase tracking-wider relative group overflow-hidden"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : (
              // Simple Google G logo SVG
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="relative z-10">
              {isLoggingIn ? 'AUTHENTICATING...' : 'Continue with Google'}
            </span>
          </motion.button>
        </div>

        <div className="mt-10 text-[10px] text-gray-600 font-mono text-center tracking-widest">
          SYS.LOGIN.VER:1.0 // ENCRYPTED_CONNECTION
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
