import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Settings, Crown, LogOut, ChevronRight, 
  Vibrate, Volume2, Mic, Moon
} from 'lucide-react';
import { useUserStore, useSettingsStore } from '@/store/useStore';
import { Switch } from '@/components/ui/switch';

export default function Profile() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);
  const isPremium = useUserStore((state) => state.isPremium);
  const token = useUserStore((state) => state.token);
  
  const vibrationEnabled = useSettingsStore((state) => state.vibrationEnabled);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const voiceGuidanceEnabled = useSettingsStore((state) => state.voiceGuidanceEnabled);
  const setVibration = useSettingsStore((state) => state.setVibration);
  const setSound = useSettingsStore((state) => state.setSound);
  const setVoiceGuidance = useSettingsStore((state) => state.setVoiceGuidance);
  const saveToServer = useSettingsStore((state) => state.saveToServer);

  const handleSettingChange = (setter, value) => {
    setter(value);
    if (isAuthenticated) {
      saveToServer(token);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="page-scroll p-6 safe-top">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-[#1A3C2F]" data-testid="profile-title">
            Profile
          </h1>
        </div>

        {/* User Card */}
        {isAuthenticated ? (
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-[#76B992]" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#1A3C2F]">{user?.name || 'User'}</h2>
                <p className="text-sm text-[#7A9B8D]">{user?.email}</p>
                {isPremium() ? (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#F4D35E] text-[#3E3208] text-xs font-bold">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                ) : (
                  <button
                    onClick={() => navigate('/subscription')}
                    className="text-sm text-[#76B992] font-medium mt-1"
                  >
                    Upgrade to Premium →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-5 text-center">
            <User className="w-12 h-12 text-[#76B992] mx-auto mb-3" />
            <h2 className="font-semibold text-[#1A3C2F] mb-2">Sign in to save progress</h2>
            <p className="text-sm text-[#7A9B8D] mb-4">
              Create an account to track your courses and sync settings across devices.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-sm py-3 px-6"
                data-testid="profile-login-btn"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary text-sm py-3 px-6"
                data-testid="profile-register-btn"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-[#1A3C2F] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#76B992]" />
            Settings
          </h3>

          <div className="space-y-4">
            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-[#76B992]" />
                </div>
                <div>
                  <p className="font-medium text-[#1A3C2F]">Vibration</p>
                  <p className="text-xs text-[#7A9B8D]">Gentle vibrations during exercises</p>
                </div>
              </div>
              <Switch
                checked={vibrationEnabled}
                onCheckedChange={(checked) => handleSettingChange(setVibration, checked)}
                data-testid="toggle-setting-vibration"
              />
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-[#76B992]" />
                </div>
                <div>
                  <p className="font-medium text-[#1A3C2F]">Sound</p>
                  <p className="text-xs text-[#7A9B8D]">Calming sounds during exercises</p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={(checked) => handleSettingChange(setSound, checked)}
                data-testid="toggle-setting-sound"
              />
            </div>

            {/* Voice Guidance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#76B992]" />
                </div>
                <div>
                  <p className="font-medium text-[#1A3C2F]">Voice Guidance</p>
                  <p className="text-xs text-[#7A9B8D]">Spoken instructions during exercises</p>
                </div>
              </div>
              <Switch
                checked={voiceGuidanceEnabled}
                onCheckedChange={(checked) => handleSettingChange(setVoiceGuidance, checked)}
                data-testid="toggle-setting-voice"
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        {!isPremium() && (
          <button
            onClick={() => navigate('/subscription')}
            className="card p-5 w-full text-left flex items-center justify-between bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20"
            data-testid="profile-subscription-btn"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F4D35E] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#3E3208]" />
              </div>
              <div>
                <p className="font-semibold text-[#1A3C2F]">Upgrade to Premium</p>
                <p className="text-sm text-[#4A6B5D]">Full courses, offline access & more</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#7A9B8D]" />
          </button>
        )}

        {/* Logout */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 text-[#E57373] font-medium"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        )}

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-[#7A9B8D]">BreatheEasy v1.0.0</p>
          <p className="text-xs text-[#7A9B8D] mt-1">Made with care for your peace of mind</p>
        </div>
      </motion.div>
    </div>
  );
}
