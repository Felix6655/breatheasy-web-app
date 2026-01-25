import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectLanguage, isRtl } from '@/i18n';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

// User store
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user, token) => set({ user, token, isAuthenticated: !!user, isLoading: false }),
      
      logout: async () => {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
          });
        } catch (e) {
          console.error('Logout error:', e);
        }
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('user-store');
      },
      
      checkAuth: async () => {
        try {
          const { token } = get();
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          
          const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
            headers
          });
          
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
            return user;
          }
        } catch (e) {
          console.error('Auth check error:', e);
        }
        set({ isLoading: false });
        return null;
      },
      
      isPremium: () => {
        const { user } = get();
        return user?.subscription_status === 'premium';
      },
      
      refreshUser: async () => {
        const { token } = get();
        try {
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
            headers
          });
          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
            return user;
          }
        } catch (e) {
          console.error('Refresh user error:', e);
        }
        return null;
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ token: state.token })
    }
  )
);

// Settings store (works offline for guests)
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      vibrationEnabled: true,
      soundEnabled: true,
      voiceGuidanceEnabled: false,
      defaultBreathingPreset: '2m',
      language: detectLanguage(),
      
      setVibration: (enabled) => set({ vibrationEnabled: enabled }),
      setSound: (enabled) => set({ soundEnabled: enabled }),
      setVoiceGuidance: (enabled) => set({ voiceGuidanceEnabled: enabled }),
      setBreathingPreset: (preset) => set({ defaultBreathingPreset: preset }),
      
      setLanguage: (lang) => {
        localStorage.setItem('breatheasy-language', lang);
        // Update document direction for RTL languages
        document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        set({ language: lang });
      },
      
      initLanguage: () => {
        const lang = get().language;
        document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      
      loadFromServer: async (token) => {
        try {
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          const response = await fetch(`${API_URL}/users/settings`, {
            credentials: 'include',
            headers
          });
          if (response.ok) {
            const settings = await response.json();
            set({
              vibrationEnabled: settings.vibration_enabled,
              soundEnabled: settings.sound_enabled,
              voiceGuidanceEnabled: settings.voice_guidance_enabled,
              defaultBreathingPreset: settings.default_breathing_preset
            });
          }
        } catch (e) {
          console.error('Failed to load settings:', e);
        }
      },
      
      saveToServer: async (token) => {
        try {
          const state = useSettingsStore.getState();
          const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          };
          
          await fetch(`${API_URL}/users/settings`, {
            method: 'PUT',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              vibration_enabled: state.vibrationEnabled,
              sound_enabled: state.soundEnabled,
              voice_guidance_enabled: state.voiceGuidanceEnabled,
              default_breathing_preset: state.defaultBreathingPreset
            })
          });
        } catch (e) {
          console.error('Failed to save settings:', e);
        }
      }
    }),
    {
      name: 'settings-store'
    }
  )
);

// Emergency session store (works offline)
export const useEmergencyStore = create(
  persist(
    (set, get) => ({
      currentStep: 0,
      sessionStartTime: null,
      isActive: false,
      helpfulItems: [],
      pendingSessions: [], // For offline sync
      
      startSession: () => set({
        currentStep: 0,
        sessionStartTime: Date.now(),
        isActive: true,
        helpfulItems: []
      }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      setStep: (step) => set({ currentStep: step }),
      
      addHelpfulItem: (item) => set((state) => ({
        helpfulItems: [...state.helpfulItems, item]
      })),
      
      endSession: async (token) => {
        const { sessionStartTime, helpfulItems, pendingSessions } = get();
        const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
        
        const sessionData = {
          helpful_items: helpfulItems,
          duration_seconds: duration,
          timestamp: new Date().toISOString()
        };
        
        // Try to save to server
        try {
          const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          };
          
          const response = await fetch(`${API_URL}/panic-sessions`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify(sessionData)
          });
          
          if (!response.ok) throw new Error('Failed to save');
          
          // Clear pending sessions on success
          set({ pendingSessions: [] });
        } catch (e) {
          // Store for later sync
          console.log('Offline: Session stored for later sync');
          set({ pendingSessions: [...pendingSessions, sessionData] });
        }
        
        set({
          currentStep: 0,
          sessionStartTime: null,
          isActive: false,
          helpfulItems: []
        });
      },
      
      syncPendingSessions: async (token) => {
        const { pendingSessions } = get();
        if (pendingSessions.length === 0) return;
        
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        
        const synced = [];
        for (const session of pendingSessions) {
          try {
            await fetch(`${API_URL}/panic-sessions`, {
              method: 'POST',
              credentials: 'include',
              headers,
              body: JSON.stringify(session)
            });
            synced.push(session);
          } catch (e) {
            break; // Stop on first failure
          }
        }
        
        if (synced.length > 0) {
          set({ pendingSessions: pendingSessions.filter(s => !synced.includes(s)) });
        }
      }
    }),
    {
      name: 'emergency-store'
    }
  )
);

// Course progress store
export const useCourseStore = create(
  persist(
    (set) => ({
      courses: [],
      currentCourse: null,
      currentLesson: null,
      
      setCourses: (courses) => set({ courses }),
      setCurrentCourse: (course) => set({ currentCourse: course }),
      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
      
      fetchCourses: async (token) => {
        try {
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          const response = await fetch(`${API_URL}/courses`, {
            credentials: 'include',
            headers
          });
          if (response.ok) {
            const courses = await response.json();
            set({ courses });
          }
        } catch (e) {
          console.error('Failed to fetch courses:', e);
        }
      }
    }),
    {
      name: 'course-store',
      partialize: (state) => ({}) // Don't persist courses
    }
  )
);

// PWA Install store
export const usePwaStore = create(
  persist(
    (set, get) => ({
      deferredPrompt: null,
      showInstallPrompt: false,
      visitCount: 0,
      hasInstalled: false,
      
      setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
      
      incrementVisit: () => {
        const { visitCount, hasInstalled } = get();
        const newCount = visitCount + 1;
        set({ visitCount: newCount });
        
        // Show prompt after 2nd visit if not installed
        if (newCount >= 2 && !hasInstalled) {
          set({ showInstallPrompt: true });
        }
      },
      
      dismissPrompt: () => set({ showInstallPrompt: false }),
      
      install: async () => {
        const { deferredPrompt } = get();
        if (!deferredPrompt) return false;
        
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          set({ hasInstalled: true, showInstallPrompt: false, deferredPrompt: null });
          return true;
        }
        
        set({ deferredPrompt: null });
        return false;
      }
    }),
    {
      name: 'pwa-store',
      partialize: (state) => ({ 
        visitCount: state.visitCount, 
        hasInstalled: state.hasInstalled 
      })
    }
  )
);

// Audio store
export const useAudioStore = create((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  audio: null,
  
  tracks: [
    { id: 'rain', name: 'Soft Rain', url: '/audio/rain.mp3' },
    { id: 'ocean', name: 'Ocean Waves', url: '/audio/ocean.mp3' },
    { id: 'whitenoise', name: 'White Noise', url: '/audio/whitenoise.mp3' }
  ],
  
  play: (trackId) => {
    const { audio, tracks } = get();
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    // Stop current audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    // Create new audio
    const newAudio = new Audio(track.url);
    newAudio.loop = true;
    newAudio.volume = get().volume;
    newAudio.play().catch(e => console.log('Audio autoplay blocked:', e));
    
    set({ audio: newAudio, currentTrack: trackId, isPlaying: true });
  },
  
  pause: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
    }
    set({ isPlaying: false });
  },
  
  resume: () => {
    const { audio } = get();
    if (audio) {
      audio.play().catch(e => console.log('Audio play blocked:', e));
    }
    set({ isPlaying: true });
  },
  
  stop: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    set({ audio: null, currentTrack: null, isPlaying: false });
  },
  
  setVolume: (vol) => {
    const { audio } = get();
    if (audio) {
      audio.volume = vol;
    }
    set({ volume: vol });
  }
}));

// Offline store
export const useOfflineStore = create((set) => ({
  isOnline: navigator.onLine,
  
  setOnline: (status) => set({ isOnline: status })
}));

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useOfflineStore.getState().setOnline(true);
    // Sync pending sessions when back online
    const token = useUserStore.getState().token;
    useEmergencyStore.getState().syncPendingSessions(token);
  });
  
  window.addEventListener('offline', () => {
    useOfflineStore.getState().setOnline(false);
  });
}
