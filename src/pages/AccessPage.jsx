import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

const AccessPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  const WEBHOOK_URL = 'https://alpha-hacker.app.n8n.cloud/webhook/live';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    let tempErrors = {};
    if (step === 1) {
      if (!formData.firstName) tempErrors.firstName = 'REQUIRED_FIELD';
      if (!formData.email) tempErrors.email = 'REQUIRED_FIELD';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'INVALID_FORMAT';
    }
    if (step === 2) {
      if (!formData.lastName) tempErrors.lastName = 'REQUIRED_FIELD';
    }
    if (step === 3) {
      if (!formData.phone) tempErrors.phone = 'REQUIRED_FIELD';
    }
    if (step === 4) {
      if (!formData.dob) tempErrors.dob = 'REQUIRED_FIELD';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok || response.status === 200) {
        localStorage.setItem('access_granted', 'true');
        localStorage.setItem('user_data', JSON.stringify(formData));
        setAccessGranted(true);
        
        setTimeout(() => {
          navigate('/login'); // Redirect to login as per plan
        }, 3000);
      } else {
        setErrors({ submit: 'SYSTEM_ERROR: WEBHOOK_UNREACHABLE' });
      }
    } catch (error) {
      setErrors({ submit: 'CONNECTION_REFUSED: NETWORK_FAILURE' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!accessGranted ? (
          <motion.div 
            key="access-form"
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-black/90 backdrop-blur-md p-8 border-2 border-neonCyan neon-box-cyan relative z-10"
          >
            {/* Corner Accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-electricRed" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-neonCyan" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-neonCyan" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-electricRed" />

            <div className="text-center mb-8">
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Fingerprint className="w-16 h-16 text-electricRed mb-4 filter drop-shadow-[0_0_8px_#ff003c]" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold glitch text-white uppercase tracking-tighter" data-text="ALPHA CYBER SECURITY ACCESS TERMINAL">
                ALPHA CYBER SECURITY <span className="text-neonCyan">ACCESS</span> <span className="text-electricRed">TERMINAL</span>
              </h2>
              <div className="h-1 w-full bg-linear-to-r from-electricRed via-neonCyan to-electricRed mt-4 opacity-50" />
              <p className="text-gray-400 font-mono mt-4 text-xs tracking-[0.2em] animate-pulse">
                [ STATUS: WAITING_FOR_INPUT ]
              </p>
            </div>

            {/* Step Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <motion.div
                    animate={s === step ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                      s < step ? 'bg-neonCyan border-neonCyan' :
                      s === step ? 'border-electricRed bg-electricRed/30 shadow-[0_0_8px_#ff003c]' :
                      'border-gray-700 bg-transparent'
                    }`}
                  />
                  {s < 4 && <div className={`w-8 h-px transition-all duration-300 ${s < step ? 'bg-neonCyan' : 'bg-gray-700'}`} />}
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-gray-500 text-center mb-6 tracking-widest uppercase">
              STEP {step} / 4 — {['NAME & EMAIL', 'LAST NAME', 'PHONE', 'DATE OF BIRTH'][step - 1]}
            </p>

            <form onSubmit={handleNext} className="space-y-5 font-mono">
              <div className="min-h-[120px]">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="group">
                        <label className="block text-neonCyan text-[10px] md:text-xs mb-1 group-hover:text-electricRed transition-colors tracking-widest uppercase">ID_FIRST_NAME</label>
                        <input 
                          type="text" 
                          name="firstName"
                          autoFocus
                          autoComplete="off"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full min-h-[44px] bg-deepBlue/30 border-b-2 ${errors.firstName ? 'border-electricRed' : 'border-neonCyan'} text-white p-2 md:p-3 focus:outline-none focus:bg-white/5 transition-all outline-none`}
                          placeholder="REQUIRED"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-neonCyan text-[10px] md:text-xs mb-1 group-hover:text-electricRed transition-colors tracking-widest uppercase">ENCRYPTED_EMAIL_ADDR</label>
                        <input 
                          type="email" 
                          name="email"
                          autoComplete="off"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full min-h-[44px] bg-deepBlue/30 border-b-2 ${errors.email ? 'border-electricRed' : 'border-neonCyan'} text-white p-2 md:p-3 focus:outline-none focus:bg-white/5 transition-all outline-none`}
                          placeholder="USER@NETWORK.CORE"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="group">
                        <label className="block text-neonCyan text-[10px] md:text-xs mb-1 group-hover:text-electricRed transition-colors tracking-widest uppercase">ID_LAST_NAME</label>
                        <input 
                          type="text" 
                          name="lastName"
                          autoFocus
                          autoComplete="off"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full min-h-[44px] bg-deepBlue/30 border-b-2 ${errors.lastName ? 'border-electricRed' : 'border-neonCyan'} text-white p-2 md:p-3 focus:outline-none focus:bg-white/5 transition-all outline-none`}
                          placeholder="REQUIRED"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="group">
                        <label className="block text-neonCyan text-[10px] md:text-xs mb-1 group-hover:text-electricRed transition-colors tracking-widest uppercase">CONTACT_PROTOCOL_PHONE</label>
                        <input 
                          type="tel" 
                          name="phone"
                          autoFocus
                          autoComplete="off"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full min-h-[44px] bg-deepBlue/30 border-b-2 ${errors.phone ? 'border-electricRed' : 'border-neonCyan'} text-white p-2 md:p-3 focus:outline-none focus:bg-white/5 transition-all outline-none`}
                          placeholder="+X XXX-XXX-XXXX"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="group">
                        <label className="block text-neonCyan text-[10px] md:text-xs mb-1 group-hover:text-electricRed transition-colors tracking-widest uppercase">TEMPORAL_MARK_DOB</label>
                        <input 
                          type="date" 
                          name="dob"
                          autoFocus
                          value={formData.dob}
                          onChange={handleChange}
                          className={`w-full min-h-[44px] bg-deepBlue/30 border-b-2 ${errors.dob ? 'border-electricRed' : 'border-neonCyan'} text-white p-2 md:p-3 focus:outline-none focus:bg-white/5 transition-all outline-none scheme-dark`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {errors.submit && (
                <div className="text-electricRed text-xs font-bold animate-pulse text-center">
                  &gt; {errors.submit}
                </div>
              )}

              <div className="flex gap-4">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 mt-8 bg-black border-2 border-gray-500 text-gray-500 p-4 font-bold uppercase tracking-[0.3em]"
                  >
                    Back
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,240,255,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 mt-8 bg-black border-2 border-neonCyan text-white p-4 font-bold uppercase tracking-[0.3em] overflow-hidden relative group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (step === 4 ? 'FINISH →' : 'NEXT →')}
                  </span>
                  <div className="absolute inset-0 bg-neonCyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              </div>
            </form>

            <div className="mt-8 text-[8px] text-gray-600 font-mono text-center opacity-50">
              V.1.0.42_CORE_SYSTEM // SECURE_TRANSMISSION_ENABLED
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="access-granted"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ["drop-shadow(0 0 10px #00f0ff)", "drop-shadow(0 0 30px #00f0ff)", "drop-shadow(0 0 10px #00f0ff)"]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ShieldCheck className="w-32 h-32 text-neonCyan mx-auto mb-6" />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black italic glitch text-white mb-4" data-text="ACCESS GRANTED">
              ACCESS GRANTED
            </h1>
            <div className="text-neonCyan font-mono tracking-[0.5em] text-xl animate-pulse">
              DECRYPTING COURSEWARE...
            </div>
            
            <div className="mt-12 flex justify-center gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 2, opacity: 0.2 }}
                  animate={{ height: [2, 15, 2], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                  className="w-1 bg-neonCyan"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessPage;
