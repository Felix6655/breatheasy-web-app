import { useEffect, useRef, createContext, useContext, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useUserStore, useSettingsStore, usePwaStore, useOfflineStore } from "@/store/useStore";
import { Toaster } from "@/components/ui/sonner";
import { getTranslation, isRtl } from "@/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Wifi, WifiOff } from "lucide-react";

// Pages
import Home from "@/pages/Home";
import HelpNow from "@/pages/HelpNow";
import Emergency from "@/pages/Emergency";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import LessonView from "@/pages/LessonView";
import Tools from "@/pages/Tools";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Subscription from "@/pages/Subscription";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import BottomNav from "@/components/BottomNav";

// i18n Context
const I18nContext = createContext(null);

export function useI18n() {
  return useContext(I18nContext);
}

function I18nProvider({ children }) {
  const language = useSettingsStore((state) => state.language);
  const initLanguage = useSettingsStore((state) => state.initLanguage);
  
  useEffect(() => {
    initLanguage();
  }, [initLanguage]);
  
  const t = (path, params) => getTranslation(language, path, params);
  const rtl = isRtl(language);
  
  return (
    <I18nContext.Provider value={{ t, language, rtl }}>
      {children}
    </I18nContext.Provider>
  );
}

// PWA Install Prompt Component
function PwaInstallPrompt() {
  const { t } = useI18n();
  const showInstallPrompt = usePwaStore((state) => state.showInstallPrompt);
  const dismissPrompt = usePwaStore((state) => state.dismissPrompt);
  const install = usePwaStore((state) => state.install);
  
  if (!showInstallPrompt) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-[#E8F5E9] p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-[#1A3C2F]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1A3C2F] font-medium mb-3">
                {t('pwa.installPrompt')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={install}
                  className="flex-1 bg-[#A8D5BA] text-[#1A3C2F] font-semibold py-2 px-4 rounded-xl text-sm"
                  data-testid="pwa-install-btn"
                >
                  {t('pwa.install')}
                </button>
                <button
                  onClick={dismissPrompt}
                  className="px-4 py-2 text-[#7A9B8D] text-sm"
                >
                  {t('pwa.notNow')}
                </button>
              </div>
            </div>
            <button onClick={dismissPrompt} className="text-[#7A9B8D]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Offline Banner
function OfflineBanner() {
  const { t } = useI18n();
  const isOnline = useOfflineStore((state) => state.isOnline);
  
  if (isOnline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#F4D35E] text-[#3E3208] py-2 px-4 text-center text-sm z-50 safe-top">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>{t('offline.youreOffline')} {t('offline.emergencyAvailable')}</span>
      </div>
    </div>
  );
}

// Upsell Modal Component
export function UpsellModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💚</span>
            </div>
            <p className="text-[#1A3C2F] mb-2">{t('upsell.braveAction')}</p>
            <p className="text-[#4A6B5D] text-sm mb-6">{t('upsell.unlockSupport')}</p>
            
            <button
              onClick={() => {
                onClose();
                navigate('/subscription');
              }}
              className="btn-primary w-full mb-3"
              data-testid="upsell-unlock-btn"
            >
              {t('upsell.unlockPremium')}
            </button>
            <button
              onClick={onClose}
              className="text-[#7A9B8D] text-sm"
            >
              {t('upsell.maybeLater')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Auth Callback Handler
function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      const hash = window.location.hash;
      const sessionId = hash.split('session_id=')[1]?.split('&')[0];

      if (!sessionId) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/session`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'X-Session-ID': sessionId,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const user = await response.json();
          setUser(user, null);
          navigate('/', { replace: true, state: { user } });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    processSession();
  }, [navigate, setUser]);

  return (
    <div className="app-container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#A8D5BA] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#4A6B5D]">Signing you in...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const location = useLocation();
  const checkAuth = useUserStore((state) => state.checkAuth);
  const isLoading = useUserStore((state) => state.isLoading);
  const incrementVisit = usePwaStore((state) => state.incrementVisit);
  const setDeferredPrompt = usePwaStore((state) => state.setDeferredPrompt);
  const isOnline = useOfflineStore((state) => state.isOnline);

  useEffect(() => {
    checkAuth();
    incrementVisit();
    
    // PWA install prompt handler
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('Service worker registered'))
        .catch((err) => console.log('Service worker registration failed:', err));
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [checkAuth, incrementVisit, setDeferredPrompt]);

  // Handle OAuth callback - check URL fragment for session_id
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A8D5BA] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#4A6B5D]">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if we're in emergency flow (hide bottom nav)
  const isEmergencyFlow = location.pathname.startsWith('/emergency');

  return (
    <div className="app-container">
      <OfflineBanner />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help-now" element={<HelpNow />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/:step" element={<Emergency />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/premium/success" element={<SubscriptionSuccess />} />
        <Route path="/premium/cancel" element={<Subscription />} />
      </Routes>
      
      {!isEmergencyFlow && <BottomNav />}
      <PwaInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </I18nProvider>
  );
}

export default App;
