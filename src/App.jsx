import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessPage from './pages/AccessPage';
import CourseHome from './pages/CourseHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import MatrixBackground from './components/MatrixBackground';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Initial fetch of the session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-black text-white font-hacker flex flex-col">
        <MatrixBackground />
        <div className="relative z-10 flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={
              session === undefined ? <LoadingScreen /> :
              session ? <Navigate to="/course" replace /> : <LoadingScreen />
            } />
            <Route path="/login" element={
              session ? <Navigate to="/course" replace /> : <LoginPage />
            } />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/course" element={
              <ProtectedRoute session={session}>
                <>
                  <Navbar />
                  <CourseHome />
                </>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute session={session}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
