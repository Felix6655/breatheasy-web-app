import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Settings, Crown, LogOut, ChevronRight, 
  Vibrate, Volume2, Mic, Globe, Check
} from 'lucide-react';
import { useUserStore, useSettingsStore } from '@/store/useStore';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/App';
import { languages } from '@/i18n';
import { useState } from 'react';

export default function Profile() {
  const navigate = useNavigate();
  const { t, language: currentLang, rtl } = useI18n();
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
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const saveToServer = useSettingsStore((state) => state.saveToServer);
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSettingChange = (setter, value) => {
    setter(value);
    if (isAuthenticated) {
      saveToServer(token);
    }
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLanguageSelector(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className={`page-scroll p-6 safe-top ${rtl ? 'rtl' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-[#1A3C2F]" data-testid="profile-title">
            {t('profile.title')}
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
                    {t('profile.upgradeToPremium')} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-5 text-center">
            <User className="w-12 h-12 text-[#76B992] mx-auto mb-3" />
            <h2 className="font-semibold text-[#1A3C2F] mb-2">{t('profile.signInToSave')}</h2>
            <p className="text-sm text-[#7A9B8D] mb-4">
              {t('profile.createAccount')}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-sm py-3 px-6"
                data-testid="profile-login-btn"
              >
                {t('profile.signIn')}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-secondary text-sm py-3 px-6"
                data-testid="profile-register-btn"
              >
                {t('profile.signUp')}
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-[#1A3C2F] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#76B992]" />
            {t('profile.settings')}
          </h3>

          <div className="space-y-4">
            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <Vibrate className="w-5 h-5 text-[#76B992]" />
                </div>
                <div>
                  <p className="font-medium text-[#1A3C2F]">{t('profile.vibration')}</p>
                  <p className="text-xs text-[#7A9B8D]">{t('profile.vibrationDesc')}</p>
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
                  <p className="font-medium text-[#1A3C2F]">{t('profile.sound')}</p>
                  <p className="text-xs text-[#7A9B8D]">{t('profile.soundDesc')}</p>
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
                  <p className="font-medium text-[#1A3C2F]">{t('profile.voiceGuidance')}</p>
                  <p className="text-xs text-[#7A9B8D]">{t('profile.voiceGuidanceDesc')}</p>
                </div>
              </div>
              <Switch
                checked={voiceGuidanceEnabled}
                onCheckedChange={(checked) => handleSettingChange(setVoiceGuidance, checked)}
                data-testid="toggle-setting-voice"
              />
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="w-full flex items-center justify-between"
                data-testid="language-selector-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#76B992]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A3C2F]">{t('profile.language')}</p>
                    <p className="text-xs text-[#7A9B8D]">{currentLanguage.nativeName}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-[#7A9B8D] transition-transform ${showLanguageSelector ? 'rotate-90' : ''}`} />
              </button>
              
              {showLanguageSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 bg-[#F7FBF9] rounded-xl overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between p-3 hover:bg-[#E8F5E9] transition-colors ${
                        currentLang === lang.code ? 'bg-[#E8F5E9]' : ''
                      }`}
                      data-testid={`lang-${lang.code}`}
                    >
                      <div>
                        <p className="font-medium text-[#1A3C2F] text-sm">{lang.nativeName}</p>
                        <p className="text-xs text-[#7A9B8D]">{lang.name}</p>
                      </div>
                      {currentLang === lang.code && (
                        <Check className="w-5 h-5 text-[#76B992]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
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
                <p className="font-semibold text-[#1A3C2F]">{t('profile.upgradeToPremium')}</p>
                <p className="text-sm text-[#4A6B5D]">{t('profile.upgradeDesc')}</p>
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
            {t('profile.signOut')}
          </button>
        )}

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-sm text-[#7A9B8D]">{t('profile.version')}</p>
          <p className="text-xs text-[#7A9B8D] mt-1">{t('profile.madeWithCare')}</p>
        </div>
      </motion.div>
    </div>
  );
}
