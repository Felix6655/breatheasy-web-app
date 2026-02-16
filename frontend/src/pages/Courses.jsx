import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useCourseStore, useUserStore } from '@/store/useStore';

export default function Courses() {
  const navigate = useNavigate();
  const courses = useCourseStore((state) => state.courses);
  const fetchCourses = useCourseStore((state) => state.fetchCourses);
  const token = useUserStore((state) => state.token);
  const isPremium = useUserStore((state) => state.isPremium);

  useEffect(() => {
    fetchCourses(token);
  }, [fetchCourses, token]);

  return (
    <div className="page-scroll p-6 safe-top">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-[#1A3C2F]" data-testid="courses-title">
            Courses
          </h1>
          <p className="text-[#4A6B5D] mt-1">Learn to manage panic, anxiety & worry</p>
        </div>

        {/* Course Categories */}
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="text-center py-8 text-[#4A6B5D]">
              <CourseSkeleton />
              <div className="mt-6 text-lg">No courses available yet.</div>
            </div>
          ) : (
            courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CourseCard
                  course={course}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  isPremium={isPremium()}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Premium CTA */}
        {!isPremium() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card p-5 bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20"
          >
            <h3 className="font-semibold text-[#1A3C2F] mb-2">Unlock All Courses</h3>
            <p className="text-sm text-[#4A6B5D] mb-4">
              Get access to all lessons, audio guides, and personalized insights.
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="btn-primary text-sm py-3"
              data-testid="courses-premium-cta"
            >
              View Premium Plans
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function CourseCard({ course, onClick, isPremium }) {
  const isLocked = course.is_locked && !isPremium;
  const progress = course.progress || 0;

  return (
    <button
      onClick={onClick}
      className="course-card w-full text-left relative group"
      data-testid={`course-card-${course.id}`}
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-full object-cover"
      />
      <div className="course-card-overlay">
        {/* Premium Badge */}
        {course.is_premium && (
          <div className="premium-badge absolute top-4 right-4">
            {isLocked ? <Lock className="w-3 h-3" /> : null}
            <span>Premium</span>
          </div>
        )}

        {/* Progress */}
        {progress > 0 && (
          <div className="mb-2">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A8D5BA] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/80 mt-1">{Math.round(progress)}% complete</span>
          </div>
        )}

        <h3 className="text-white text-xl font-bold mb-1">{course.title}</h3>
        <p className="text-white/80 text-sm mb-2">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-xs">
            {course.module_count} modules • {course.lesson_count} lessons
          </span>
          <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="locked-overlay rounded-3xl">
          <div className="text-center">
            <Lock className="w-8 h-8 text-[#7A9B8D] mx-auto mb-2" />
            <span className="text-sm text-[#4A6B5D]">Premium Course</span>
          </div>
        </div>
      )}
    </button>
  );
}

function CourseSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="course-card bg-[#E8F5E9] animate-pulse">
          <div className="p-5 h-full flex flex-col justify-end">
            <div className="h-6 bg-[#A8D5BA]/30 rounded w-3/4 mb-2" />
            <div className="h-4 bg-[#A8D5BA]/30 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
