import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus } from 'lucide-react';
import { useI18n } from '@/App';

const DISMISSAL_KEY = 'pwa-install-dismissed';
const INSTALLED_KEY = 'pwa-installed';
const DISMISSAL_DAYS = 7;

export default function InstallBanner() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Check if app is already installed
  const checkInstalled = useCallback(() => {
    // Check display-mode standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Check iOS standalone (Safari)
    const isIOSStandalone = window.navigator.standalone === true;
    // Check localStorage flag
    const hasInstalledFlag = localStorage.getItem(INSTALLED_KEY) === 'true';
    
    return isStandalone || isIOSStandalone || hasInstalledFlag;
  }, []);

  // Check if dismissal is still valid (within 7 days)
  const isDismissed = useCallback(() => {
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
    if (!dismissedAt) return false;
    
    const dismissedDate = new Date(parseInt(dismissedAt, 10));
    const now = new Date();
    const daysDiff = (now - dismissedDate) / (1000 * 60 * 60 * 24);
    
    return daysDiff < DISMISSAL_DAYS;
  }, []);

  // Detect iOS Safari
  const detectIOS = useCallback(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|fxios|edgios/.test(ua);
    return isIOSDevice && isSafari;
  }, []);

  useEffect(() => {
    // Check if already installed
    if (checkInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Check iOS
    const iosDetected = detectIOS();
    setIsIOS(iosDetected);

    // Check if dismissed recently
    if (isDismissed()) {
      return;
    }

    // For iOS, show banner immediately (after a small delay)
    if (iosDetected) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    // For non-iOS, wait for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after prompt is available
      setTimeout(() => setIsVisible(true), 1500);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem(INSTALLED_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsVisible(false);
        localStorage.setItem(INSTALLED_KEY, 'true');
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [checkInstalled, isDismissed, detectIOS]);

  // Handle install click
  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem(INSTALLED_KEY, 'true');
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setIsVisible(false);
    } catch (error) {
      console.error('Install prompt error:', error);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    setIsVisible(false);
  };

  // Don't render if installed or not visible
  if (isInstalled || !isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40"
          data-testid="install-banner"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-[#E8F5E9] p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-[#1A3C2F]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#1A3C2F] font-medium mb-1">
                  {t('pwa.installPrompt') || 'Add BreatheEasy to your home screen for instant calm support.'}
                </p>
                {isIOS && (
                  <p className="text-xs text-[#7A9B8D] mb-2">
                    Tap below for instructions
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="flex-1 bg-[#A8D5BA] text-[#1A3C2F] font-semibold py-2 px-4 rounded-xl text-sm hover:bg-[#96C9A9] transition-colors"
                    data-testid="pwa-install-btn"
                  >
                    {isIOS ? 'How to install' : (t('pwa.install') || 'Install')}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 text-[#7A9B8D] text-sm hover:text-[#4A6B5D] transition-colors"
                    data-testid="pwa-dismiss-btn"
                  >
                    {t('pwa.notNow') || 'Not now'}
                  </button>
                </div>
              </div>
              <button 
                onClick={handleDismiss} 
                className="text-[#7A9B8D] hover:text-[#4A6B5D] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* iOS Installation Instructions Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowIOSModal(false)}
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
                  <Download className="w-8 h-8 text-[#76B992]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A3C2F] mb-2">
                  Install BreatheEasy
                </h3>
                <p className="text-sm text-[#4A6B5D] mb-6">
                  Add this app to your home screen for quick access anytime.
                </p>
                
                <div className="space-y-4 text-left mb-6">
                  <div className="flex items-center gap-3 p-3 bg-[#F7FBF9] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#1A3C2F]">Tap the</span>
                      <Share className="w-5 h-5 text-[#007AFF]" />
                      <span className="text-sm text-[#1A3C2F] font-medium">Share</span>
                      <span className="text-sm text-[#1A3C2F]">button</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#F7FBF9] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#1A3C2F]">Scroll and tap</span>
                      <Plus className="w-5 h-5 text-[#007AFF]" />
                      <span className="text-sm text-[#1A3C2F] font-medium">Add to Home Screen</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#F7FBF9] rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-[#A8D5BA] flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">3</span>
                    </div>
                    <span className="text-sm text-[#1A3C2F]">Tap <span className="font-medium">Add</span> in the top right</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full bg-[#A8D5BA] text-[#1A3C2F] font-semibold py-3 px-4 rounded-xl hover:bg-[#96C9A9] transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
