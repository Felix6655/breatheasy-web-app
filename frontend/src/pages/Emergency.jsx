import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergencyStore, useSettingsStore, useUserStore, useAudioStore } from '@/store/useStore';
import { useState, useEffect, useCallback } from 'react';
import { Heart, Volume2, VolumeX, Vibrate, X, ChevronRight, Check, Music } from 'lucide-react';
import { useI18n, UpsellModal } from '@/App';

// Emergency steps
const STEPS = ['safety', 'breathing', 'grounding', 'reassurance', 'recovery'];

// Grounding images
const groundingImages = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=400&fit=crop'
];

export default function Emergency() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { t, rtl } = useI18n();
  const currentStep = STEPS.indexOf(step || 'safety');
  
  const endSession = useEmergencyStore((state) => state.endSession);
  const addHelpfulItem = useEmergencyStore((state) => state.addHelpfulItem);
  const token = useUserStore((state) => state.token);
  const isPremium = useUserStore((state) => state.isPremium);
  
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const setSound = useSettingsStore((state) => state.setSound);
  const setVibration = useSettingsStore((state) => state.setVibration);
  
  const play = useAudioStore((state) => state.play);
  const stop = useAudioStore((state) => state.stop);
  
  const [showUpsell, setShowUpsell] = useState(false);

  const goToStep = (stepName) => {
    navigate(`/emergency/${stepName}`, { replace: true });
  };

  const handleFinish = async () => {
    await endSession(token);
    stop(); // Stop any playing audio
    
    // Show upsell for non-premium users
    if (!isPremium()) {
      setShowUpsell(true);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleUpsellClose = () => {
    setShowUpsell(false);
    navigate('/', { replace: true });
  };

  // Vibrate on certain steps
  useEffect(() => {
    if (vibrationEnabled && navigator.vibrate) {
      if (step === 'safety') {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [step, vibrationEnabled]);

  // Play calming audio if sound is enabled
  useEffect(() => {
    if (soundEnabled && step === 'breathing') {
      play('rain');
    }
    return () => {
      if (step === 'recovery') {
        stop();
      }
    };
  }, [soundEnabled, step, play, stop]);

  return (
    <div className={`emergency-bg min-h-screen relative ${rtl ? 'rtl' : ''}`}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 safe-top">
        <button
          onClick={() => {
            stop();
            navigate('/');
          }}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
          data-testid="emergency-close"
        >
          <X className="w-5 h-5 text-[#4A6B5D]" />
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSound(!soundEnabled)}
            className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center ${soundEnabled ? 'bg-[#A8D5BA]' : 'bg-white/80'}`}
            data-testid="toggle-sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#1A3C2F]" /> : <VolumeX className="w-5 h-5 text-[#7A9B8D]" />}
          </button>
          <button
            onClick={() => setVibration(!vibrationEnabled)}
            className={`w-10 h-10 rounded-full backdrop-blur flex items-center justify-center ${vibrationEnabled ? 'bg-[#A8D5BA]' : 'bg-white/80'}`}
            data-testid="toggle-vibration"
          >
            <Vibrate className={`w-5 h-5 ${vibrationEnabled ? 'text-[#1A3C2F]' : 'text-[#7A9B8D]'}`} />
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="absolute top-20 left-0 right-0 flex justify-center gap-2 safe-top">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all ${i <= currentStep ? 'bg-[#76B992]' : 'bg-[#A8D5BA]/30'}`}
          />
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 'safety' && (
          <SafetyStep key="safety" onContinue={() => goToStep('breathing')} t={t} />
        )}
        {step === 'breathing' && (
          <BreathingStep key="breathing" onContinue={() => goToStep('grounding')} soundEnabled={soundEnabled} vibrationEnabled={vibrationEnabled} t={t} />
        )}
        {step === 'grounding' && (
          <GroundingStep key="grounding" onContinue={() => goToStep('reassurance')} t={t} onPlaySound={() => play('ocean')} />
        )}
        {step === 'reassurance' && (
          <ReassuranceStep key="reassurance" onContinue={() => goToStep('recovery')} t={t} />
        )}
        {step === 'recovery' && (
          <RecoveryStep key="recovery" onFinish={handleFinish} onSelectItem={addHelpfulItem} t={t} />
        )}
      </AnimatePresence>
      
      <UpsellModal isOpen={showUpsell} onClose={handleUpsellClose} />
    </div>
  );
}

// Safety Step
function SafetyStep({ onContinue, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      data-testid="emergency-safety-step"
    >
      <p className="text-sm text-[#7A9B8D] mb-4">{t('emergency.emergency')}</p>
      
      <h1 className="text-2xl text-[#4A6B5D] mb-2 italic">{t('helpNow.imHere')}</h1>
      <h1 className="text-2xl text-[#4A6B5D] mb-2 italic">{t('emergency.focusOnVoice')}</h1>
      
      <h2 className="safe-text-large mt-6 mb-2">{t('emergency.youreSafeShort')}</h2>
      <h2 className="safe-text-large mb-8">{t('emergency.breatheWithMe')}</h2>
      
      <motion.button
        onClick={onContinue}
        className="btn-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="safety-continue-btn"
      >
        {t('emergency.startBreathing')}
      </motion.button>
    </motion.div>
  );
}

// Breathing Step
function BreathingStep({ onContinue, soundEnabled, vibrationEnabled, t }) {
  const [phase, setPhase] = useState('inhale');
  const [messageIndex, setMessageIndex] = useState(0);
  const [seconds, setSeconds] = useState(120); // 2 minutes default
  const [isRunning, setIsRunning] = useState(true);

  const breathingMessages = [
    t('emergency.breatheInSlowly'),
    t('emergency.goodBreatheOut'),
    t('emergency.youreDoingWell'),
    t('emergency.stayWithMe'),
  ];

  // Breathing cycle: 4s inhale, 6s exhale
  useEffect(() => {
    if (!isRunning) return;

    const inhaleTime = 4000;
    const exhaleTime = 6000;

    const cycle = () => {
      setPhase('inhale');
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
      
      setTimeout(() => {
        setPhase('exhale');
        if (vibrationEnabled && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, inhaleTime);
    };

    cycle();
    const interval = setInterval(cycle, inhaleTime + exhaleTime);

    return () => clearInterval(interval);
  }, [isRunning, vibrationEnabled]);

  // Message rotation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % breathingMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning, breathingMessages.length]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      data-testid="emergency-breathing-step"
    >
      <p className="text-sm text-[#7A9B8D] mb-2">{t('emergency.doingGreat')}</p>
      <p className="text-[#4A6B5D] mb-8">{t('emergency.keepBreathing')}</p>

      {/* Breathing Circle */}
      <div className="relative mb-8">
        <motion.div
          className="breathing-circle"
          animate={{
            scale: phase === 'inhale' ? 1.5 : 1,
            opacity: phase === 'inhale' ? 1 : 0.8,
          }}
          transition={{
            duration: phase === 'inhale' ? 4 : 6,
            ease: 'easeInOut'
          }}
        >
          <span className="text-[#1A3C2F] text-xl font-semibold">
            {phase === 'inhale' ? t('emergency.breatheIn') : t('emergency.breatheOut')}
          </span>
        </motion.div>
        
        {/* Outer rings */}
        <motion.div
          className="breathing-ring w-[220px] h-[220px] -top-[10px] -left-[10px]"
          animate={{ scale: phase === 'inhale' ? 1.5 : 1 }}
          transition={{ duration: phase === 'inhale' ? 4 : 6, ease: 'easeInOut' }}
          style={{ position: 'absolute' }}
        />
        <motion.div
          className="breathing-ring w-[240px] h-[240px] -top-[20px] -left-[20px] border-2"
          animate={{ scale: phase === 'inhale' ? 1.5 : 1 }}
          transition={{ duration: phase === 'inhale' ? 4 : 6, ease: 'easeInOut', delay: 0.1 }}
          style={{ position: 'absolute' }}
        />
      </div>

      {/* Timer */}
      <div className="text-4xl font-bold text-[#1A3C2F] mb-2">{formatTime(seconds)}</div>
      <p className="text-sm text-[#7A9B8D] mb-8">{breathingMessages[messageIndex]}</p>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="btn-secondary"
          data-testid="breathing-toggle"
        >
          {isRunning ? t('emergency.pause') : t('emergency.resume')}
        </button>
        <button
          onClick={onContinue}
          className="btn-primary"
          data-testid="breathing-continue"
        >
          {t('emergency.continue')}
        </button>
      </div>

      <p className="text-xs text-[#7A9B8D] mt-4">
        {soundEnabled ? t('emergency.softSoundsOn') : t('emergency.soundsOff')} • {vibrationEnabled ? t('emergency.softVibrationsOn') : t('emergency.vibrationsOff')}
      </p>
    </motion.div>
  );
}

// Grounding Step
function GroundingStep({ onContinue, t, onPlaySound }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompts = [
    t('emergency.noticeThingSee'),
    t('emergency.noticeSound'),
    t('emergency.noticeSensation'),
    t('emergency.feelFeet'),
    t('emergency.noticeBreath'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      data-testid="emergency-grounding-step"
    >
      <p className="text-sm text-[#7A9B8D] mb-4">{t('emergency.grounding')}</p>
      
      <h1 className="safe-text-large mb-2">{prompts[promptIndex]}</h1>
      <p className="text-[#4A6B5D] mb-8">{t('emergency.describeYourself')}</p>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {prompts.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${i <= promptIndex ? 'bg-[#76B992]' : 'bg-[#A8D5BA]/30'}`}
          />
        ))}
      </div>

      {/* Grounding images */}
      <div className="grounding-images mb-8">
        {groundingImages.map((src, i) => (
          <img key={i} src={src} alt="Calming" className="grounding-image" />
        ))}
      </div>

      {/* Buttons */}
      <div className="space-y-3 w-full max-w-xs">
        <button
          onClick={() => {
            if (promptIndex < prompts.length - 1) {
              setPromptIndex(promptIndex + 1);
            } else {
              onContinue();
            }
          }}
          className="btn-primary w-full"
          data-testid="grounding-next"
        >
          {promptIndex < prompts.length - 1 ? t('emergency.countAnother') : t('emergency.continue')}
        </button>
        <button
          onClick={onPlaySound}
          className="btn-secondary w-full flex items-center justify-center gap-2"
          data-testid="grounding-sounds"
        >
          <Music className="w-4 h-4" />
          {t('emergency.hearCalmingSounds')}
        </button>
      </div>
    </motion.div>
  );
}

// Reassurance Step
function ReassuranceStep({ onContinue, t }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 99));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      data-testid="emergency-reassurance-step"
    >
      <Heart className="w-10 h-10 text-[#76B992] mb-4" fill="#A8D5BA" />
      
      <h1 className="safe-text-large mb-4">{t('emergency.goingToBeOkay')}</h1>
      
      <p className="text-[#4A6B5D] mb-8">
        {t('emergency.feelingWillPass')}
      </p>

      {/* Progress Ring */}
      <div className="relative w-40 h-40 mb-8">
        <svg className="w-full h-full progress-ring-circle">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#E8F5E9"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#A8D5BA"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-[#7A9B8D]">{t('emergency.moreAtEase')}</span>
          <span className="text-4xl font-bold text-[#1A3C2F]">{progress}%</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="btn-primary"
        data-testid="reassurance-continue"
      >
        {t('emergency.finish')}
      </button>
    </motion.div>
  );
}

// Recovery Step
function RecoveryStep({ onFinish, onSelectItem, t }) {
  const [selected, setSelected] = useState([]);

  const helpfulOptions = [
    { id: 'breathing', label: t('emergency.breathing') },
    { id: 'grounding', label: t('emergency.grounding') },
    { id: 'reassuring', label: t('emergency.reassuringThoughts') },
    { id: 'closing-eyes', label: t('emergency.closingEyes') },
    { id: 'something-else', label: t('emergency.somethingElse') }
  ];

  const toggleItem = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
      onSelectItem(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      data-testid="emergency-recovery-step"
    >
      <Heart className="w-10 h-10 text-[#76B992] mb-4" fill="#A8D5BA" />
      
      <h1 className="safe-text-large mb-6">{t('emergency.youreOkayNow')}</h1>
      
      <p className="text-[#4A6B5D] mb-6">{t('emergency.whatHelped')}</p>

      {/* Options */}
      <div className="space-y-3 w-full max-w-xs mb-8">
        {helpfulOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => toggleItem(option.id)}
            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selected.includes(option.id)
                ? 'border-[#A8D5BA] bg-[#E8F5E9]'
                : 'border-[#E8F5E9] bg-white'
            }`}
            data-testid={`recovery-option-${option.id}`}
          >
            <span className="text-[#1A3C2F] font-medium">{option.label}</span>
            {selected.includes(option.id) && (
              <Check className="w-5 h-5 text-[#76B992]" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onFinish}
        className="btn-primary w-full max-w-xs"
        data-testid="recovery-finish"
      >
        {t('emergency.finish')}
      </button>
    </motion.div>
  );
}
