import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShineBorder from '../components/ShineBorder';
import TiltCard from '../components/TiltCard';
import MeteorBackground from '../components/MeteorBackground';
import SpotlightCard from '../components/SpotlightCard';

const Login = () => {
  const { loginWithGoogle, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}
    >
      <MeteorBackground />
      
      <SpotlightCard>
        <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} className="w-full max-w-md sm:max-w-sm">
          <TiltCard>
            <div 
              className="rounded-3xl p-6 sm:p-10 w-full text-center relative z-10"
              style={{ 
                background: 'rgba(8, 8, 14, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)', 
                  boxShadow: '0 0 60px rgba(123, 47, 255, 0.5)' 
                }}
              >
                <img src="/logo.png" alt="PaisaTrack" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl font-bold mb-3"
                style={{ 
                  fontFamily: 'Ruckle, sans-serif',
                  background: 'linear-gradient(135deg, #A07CFE 0%, #FE8FB5 50%, #FFBE7B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                PaisaTrack
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 mb-6 sm:mb-10 text-sm sm:text-base tracking-wide"
                style={{ fontFamily: 'Ruckle, sans-serif' }}
              >
                Apna paisa, apna hisaab
              </motion.p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {loading ? (
                <div className="flex justify-center">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                </div>
              ) : (
                <button onClick={handleLogin} className="button w-full">
                  <svg className="icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 text-xs text-gray-600"
                style={{ fontFamily: 'Ruckle, sans-serif' }}
              >
                By continuing, you agree to our Terms of Service and Privacy Policy
              </motion.p>
            </div>
          </TiltCard>
        </ShineBorder>
      </SpotlightCard>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .button {
          position: relative;
          transition: all 0.3s ease-in-out;
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
          padding-block: 0.875rem;
          padding-inline: 1.25rem;
          background-color: rgb(0 107 179);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffff;
          gap: 10px;
          font-weight: bold;
          border: 3px solid #ffffff4d;
          outline: none;
          overflow: hidden;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Ruckle, sans-serif';
          min-height: 52px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .icon {
          width: 20px;
          height: 20px;
          transition: all 0.3s ease-in-out;
          flex-shrink: 0;
        }
        .button:hover {
          transform: scale(1.02);
          border-color: #fff9;
        }
        .button:active {
          transform: scale(0.98);
        }
        .button:hover .icon {
          transform: translate(4px);
        }
        .button:hover::before {
          animation: shine 1.5s ease-out infinite;
        }
        .button::before {
          content: "";
          position: absolute;
          width: 100px;
          height: 100%;
          background-image: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0) 70%
          );
          top: 0;
          left: -100px;
          opacity: 0.6;
        }
        @keyframes shine {
          0% { left: -100px; }
          60% { left: 100%; }
          to { left: 100%; }
        }
        @media (max-width: 380px) {
          .button {
            font-size: 13px;
            padding-inline: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
