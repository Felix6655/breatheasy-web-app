import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useEmergencyStore } from '@/store/useStore';
import { SEOHead } from '@/components/SEOHead';

export default function HelpNow() {
  const navigate = useNavigate();
  const startSession = useEmergencyStore((state) => state.startSession);

  const handleStartEmergency = () => {
    startSession();
    navigate('/emergency/safety');
  };

  return (
    <>
      <SEOHead page="helpNow" />
      <div className="emergency-bg min-h-screen flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-sm"
      >
        {/* Heart Icon */}
        <motion.div
          className="mb-8"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 rounded-full bg-[#A8D5BA]/30 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-[#76B992]" fill="#A8D5BA" />
          </div>
        </motion.div>

        {/* Main Message */}
        <h1 className="text-3xl font-bold text-[#1A3C2F] mb-4" data-testid="help-now-title">
          I'm here with you.
        </h1>
        
        <p className="text-lg text-[#4A6B5D] mb-2 leading-relaxed">
          You're safe right now.
        </p>
        
        <p className="text-lg text-[#4A6B5D] mb-8 leading-relaxed">
          This feeling will pass.
        </p>

        {/* Start Button */}
        <motion.button
          onClick={handleStartEmergency}
          className="btn-primary w-full flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="start-calming-btn"
        >
          <span>Start calming</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-sm text-[#7A9B8D] mt-4">
          Guided support for the next few minutes
        </p>

        {/* Back to Home Link */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-[#7A9B8D] mt-8 hover:text-[#4A6B5D] transition-colors"
          data-testid="back-to-home-link"
        >
          I'm feeling okay → Back to home
        </button>
      </motion.div>
    </div>
    </>
  );
}
