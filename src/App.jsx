import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccessPage from './pages/AccessPage';
import CourseHome from './pages/CourseHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import MatrixBackground from './components/MatrixBackground';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black text-white font-hacker flex flex-col">
        <MatrixBackground />
        <div className="relative z-10 flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LoadingScreen />} />
            <Route path="/access" element={<AccessPage />} />
            <Route path="/course" element={
              <>
                <Navbar />
                <CourseHome />
              </>
            } />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
