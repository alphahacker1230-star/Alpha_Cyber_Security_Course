import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, AlertCircle } from 'lucide-react';

const AccessPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = 'REQUIRED_FIELD';
    if (!formData.lastName) tempErrors.lastName = 'REQUIRED_FIELD';
    if (!formData.email) tempErrors.email = 'REQUIRED_FIELD';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'INVALID_FORMAT';
    if (!formData.phone) tempErrors.phone = 'REQUIRED_FIELD';
    if (!formData.dob) tempErrors.dob = 'REQUIRED_FIELD';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('access_granted', 'true');
      localStorage.setItem('user_data', JSON.stringify(formData));
      
      // Simulate hacking the authorization process
      setTimeout(() => {
        navigate('/course');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-black/80 backdrop-blur-sm p-8 neon-box-cyan"
      >
        <div className="text-center mb-8">
          <Fingerprint className="w-16 h-16 text-neonCyan mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold glitch text-neonCyan" data-text="ACCESS AUTHORIZATION REQUIRED">
            ACCESS AUTHORIZATION REQUIRED
          </h2>
          <p className="text-gray-400 font-mono mt-2 text-sm">// ENTER CREDENTIALS TO PROCEED</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neonCyan text-xs mb-1">FIRST_NAME</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full bg-deepBlue/50 border ${errors.firstName ? 'border-electricRed' : 'border-neonCyan/50'} text-white p-2 focus:outline-none focus:border-neonCyan focus:shadow-[0_0_10px_#00f0ff] transition-all`}
              />
              {errors.firstName && <div className="text-electricRed text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.firstName}</div>}
            </div>
            <div>
              <label className="block text-neonCyan text-xs mb-1">LAST_NAME</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full bg-deepBlue/50 border ${errors.lastName ? 'border-electricRed' : 'border-neonCyan/50'} text-white p-2 focus:outline-none focus:border-neonCyan focus:shadow-[0_0_10px_#00f0ff] transition-all`}
              />
              {errors.lastName && <div className="text-electricRed text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.lastName}</div>}
            </div>
          </div>

          <div>
            <label className="block text-neonCyan text-xs mb-1">VALID_EMAIL</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-deepBlue/50 border ${errors.email ? 'border-electricRed' : 'border-neonCyan/50'} text-white p-2 focus:outline-none focus:border-neonCyan focus:shadow-[0_0_10px_#00f0ff] transition-all`}
            />
            {errors.email && <div className="text-electricRed text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.email}</div>}
          </div>

          <div>
            <label className="block text-neonCyan text-xs mb-1">PHONE_NUMBER</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-deepBlue/50 border ${errors.phone ? 'border-electricRed' : 'border-neonCyan/50'} text-white p-2 focus:outline-none focus:border-neonCyan focus:shadow-[0_0_10px_#00f0ff] transition-all`}
            />
            {errors.phone && <div className="text-electricRed text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.phone}</div>}
          </div>

          <div>
            <label className="block text-neonCyan text-xs mb-1">DATE_OF_BIRTH</label>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full bg-deepBlue/50 border ${errors.dob ? 'border-electricRed' : 'border-neonCyan/50'} text-white p-2 focus:outline-none focus:border-neonCyan focus:shadow-[0_0_10px_#00f0ff] transition-all`}
            />
            {errors.dob && <div className="text-electricRed text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.dob}</div>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, textShadow: "0 0 8px rgb(0,240,255)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-6 bg-deepBlue border border-neonCyan text-neonCyan font-bold py-3 uppercase tracking-widest hover:bg-neonCyan hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
          >
            ACCESS COURSE
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AccessPage;
