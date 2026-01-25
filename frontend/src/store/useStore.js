import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    (set) => ({
      vibrationEnabled: true,
      soundEnabled: true,
      voiceGuidanceEnabled: false,
      defaultBreathingPreset: '2m',
      
      setVibration: (enabled) => set({ vibrationEnabled: enabled }),
      setSound: (enabled) => set({ soundEnabled: enabled }),
      setVoiceGuidance: (enabled) => set({ voiceGuidanceEnabled: enabled }),
      setBreathingPreset: (preset) => set({ defaultBreathingPreset: preset }),
      
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
        const { sessionStartTime, helpfulItems } = get();
        const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
        
        // Save to server if possible
        try {
          const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          };
          
          await fetch(`${API_URL}/panic-sessions`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              helpful_items: helpfulItems,
              duration_seconds: duration
            })
          });
        } catch (e) {
          // Silently fail - offline support
          console.log('Could not save session to server');
        }
        
        set({
          currentStep: 0,
          sessionStartTime: null,
          isActive: false,
          helpfulItems: []
        });
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
