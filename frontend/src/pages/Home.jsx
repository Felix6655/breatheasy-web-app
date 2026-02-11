import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useUserStore, useCourseStore } from '@/store/useStore';
import { useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';

export default function Home() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    fetchCourses(token);
  }, [fetchCourses, token]);

  const dailyTips = [
    "Remember: Panic attacks always pass. Your body cannot maintain this state forever.",
    "Breathe slowly. Your breath is your anchor.",
    "Ground yourself: Name 5 things you can see right now.",
    "This feeling is temporary. You've survived every panic attack before.",
  ];

  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

  return (
    <>
      <SEOHead page="home" />
      <div className="page-scroll p-6 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
        {/* Header */}
        <div className="text-center pt-4">
          <h1 className="text-3xl font-bold text-[#1A3C2F] mb-2" data-testid="home-title">
            {user ? `Welcome back, ${user.name?.split(' ')[0]}` : 'Welcome'}
          </h1>
          <p className="text-[#4A6B5D]">How are you feeling today?</p>
        </div>

        {/* Panic Button - Main CTA */}
        <motion.div 
          className="flex flex-col items-center py-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/help-now')}
            className="panic-button panic-button-pulse"
            data-testid="panic-button-home"
          >
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-1" fill="currentColor" />
              <span className="text-sm font-bold leading-tight block">I need<br/>help now</span>
            </div>
          </button>
          <p className="text-sm text-[#7A9B8D] mt-4">Tap if you're feeling anxious or panicking</p>
        </motion.div>

        {/* Daily Tip */}
        <motion.div
          className="card p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          data-testid="daily-tip-card"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#76B992]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A3C2F] mb-1">Daily Reminder</h3>
              <p className="text-sm text-[#4A6B5D] leading-relaxed">{randomTip}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1A3C2F]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => navigate('/tools')}
              className="card p-4 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="quick-breathing"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A8D5BA]/20 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[#76B992]" />
              </div>
              <h3 className="font-semibold text-[#1A3C2F] text-sm">Quick Calm</h3>
              <p className="text-xs text-[#7A9B8D] mt-1">60 second breathing</p>
            </motion.button>

            <motion.button
              onClick={() => navigate('/courses')}
              className="card p-4 text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="quick-courses"
            >
              <div className="w-10 h-10 rounded-xl bg-[#BCE3E1]/30 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-[#4A6B5D]" />
              </div>
              <h3 className="font-semibold text-[#1A3C2F] text-sm">Learn</h3>
              <p className="text-xs text-[#7A9B8D] mt-1">Understand panic</p>
            </motion.button>
          </div>
        </div>

        {/* Encouragement */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-[#7A9B8D] italic">
            "You're stronger than you think. Every moment of calm is a victory."
          </p>
        </motion.div>

        {/* SEO Footer Links */}
        <div className="pt-4 pb-20 border-t border-[#E8F5E9]">
          <p className="text-xs text-[#7A9B8D] mb-3">Learn more:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/panic-attack-help" className="text-xs text-[#76B992] hover:underline">
              Panic Attack Help
            </Link>
            <Link to="/breathing-exercise" className="text-xs text-[#76B992] hover:underline">
              Breathing Exercises
            </Link>
            <Link to="/anxiety-tools" className="text-xs text-[#76B992] hover:underline">
              Anxiety Tools
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
}
