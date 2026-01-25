import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Check, ChevronRight, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useStore';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useUserStore((state) => state.token);
  const isPremium = useUserStore((state) => state.isPremium);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
          credentials: 'include',
          headers
        });
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  if (loading) {
    return (
      <div className="page-scroll p-6 safe-top">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-[#E8F5E9] rounded-3xl" />
          <div className="h-6 bg-[#E8F5E9] rounded w-3/4" />
          <div className="h-4 bg-[#E8F5E9] rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page-scroll p-6 safe-top text-center">
        <p className="text-[#4A6B5D]">Course not found</p>
        <button onClick={() => navigate('/courses')} className="btn-primary mt-4">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="page-scroll safe-top">
      {/* Hero Image */}
      <div className="relative h-48">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C2F]/80 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/courses')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
          data-testid="course-detail-back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A3C2F]" />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white text-2xl font-bold">{course.title}</h1>
          <p className="text-white/80 text-sm">{course.description}</p>
        </div>
      </div>

      {/* Modules */}
      <div className="p-6 space-y-6">
        {course.modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold text-[#1A3C2F]">
              Module {moduleIndex + 1}: {module.title}
            </h2>

            <div className="space-y-2">
              {module.lessons.map((lesson) => {
                const isLocked = lesson.is_locked && !isPremium();
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => !isLocked && navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                    className={`w-full card p-4 flex items-center justify-between ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
                    data-testid={`lesson-${lesson.id}`}
                    disabled={isLocked}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        lesson.completed ? 'bg-[#A8D5BA]' : 'bg-[#E8F5E9]'
                      }`}>
                        {lesson.completed ? (
                          <Check className="w-5 h-5 text-[#1A3C2F]" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-[#7A9B8D]" />
                        ) : (
                          <Play className="w-5 h-5 text-[#4A6B5D]" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-[#1A3C2F]">{lesson.title}</h3>
                        <p className="text-xs text-[#7A9B8D]">{lesson.duration}</p>
                      </div>
                    </div>
                    
                    {!isLocked && (
                      <ChevronRight className="w-5 h-5 text-[#7A9B8D]" />
                    )}
                    
                    {isLocked && (
                      <span className="premium-badge text-xs">Premium</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Premium CTA */}
        {!isPremium() && course.is_premium && (
          <div className="card p-5 bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20">
            <h3 className="font-semibold text-[#1A3C2F] mb-2">Unlock This Course</h3>
            <p className="text-sm text-[#4A6B5D] mb-4">
              Get full access to all lessons and audio guides.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="btn-primary text-sm py-3"
              data-testid="course-detail-premium-cta"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
