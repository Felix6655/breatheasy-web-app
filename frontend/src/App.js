import { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useStore";
import { Toaster } from "@/components/ui/sonner";

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

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH

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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
      </Routes>
      
      {!isEmergencyFlow && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
