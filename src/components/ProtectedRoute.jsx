import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ session, children }) => {
  const location = useLocation();

  if (session === undefined) {
    // Session is still being loaded
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/90 p-4 relative overflow-hidden font-mono">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md bg-black border-2 border-neonCyan p-8 text-center"
        >
          <div className="text-neonCyan font-mono tracking-[0.5em] text-xl animate-pulse">
            LOADING_SESSION...
          </div>
        </motion.div>
      </div>
    );
  }

  if (!session) {
    // Redirect to login page and preserve the intended location to redirect back after login if needed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
