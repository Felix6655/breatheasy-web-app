import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Play, Pause, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useStore';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/courses/${courseId}/lessons/${lessonId}`, {
          credentials: 'include',
          headers
        });
        
        if (response.status === 403) {
          setError('premium');
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setLesson(data);
        } else {
          setError('not-found');
        }
      } catch (err) {
        console.error('Failed to fetch lesson:', err);
        setError('error');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId, token]);

  const handleComplete = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      
      await fetch(`${API_URL}/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        credentials: 'include',
        headers
      });
      
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-scroll p-6 safe-top">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E8F5E9] rounded w-3/4" />
          <div className="h-4 bg-[#E8F5E9] rounded w-1/2" />
          <div className="space-y-2 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-[#E8F5E9] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error === 'premium') {
    return (
      <div className="page-scroll p-6 safe-top text-center flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-[#1A3C2F] mb-4">Premium Content</h2>
        <p className="text-[#4A6B5D] mb-6">This lesson requires a premium subscription.</p>
        <button onClick={() => navigate('/subscription')} className="btn-primary mb-4">
          Upgrade to Premium
        </button>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-ghost">
          Back to Course
        </button>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="page-scroll p-6 safe-top text-center">
        <p className="text-[#4A6B5D]">Lesson not found</p>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-primary mt-4">
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="page-scroll safe-top">
      {/* Header */}
      <div className="sticky top-0 bg-[#F7FBF9] border-b border-[#E8F5E9] p-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          data-testid="lesson-back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A3C2F]" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-[#1A3C2F] truncate">{lesson.title}</h1>
          <p className="text-xs text-[#7A9B8D]">{lesson.duration}</p>
        </div>
      </div>

      {/* Audio Player (placeholder) */}
      {lesson.audio_url !== null && (
        <div className="audio-player mx-6 mt-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="audio-play-btn"
            data-testid="lesson-audio-toggle"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <div className="h-2 bg-[#E8F5E9] rounded-full">
              <div className="h-full bg-[#A8D5BA] rounded-full w-1/3" />
            </div>
            <div className="flex justify-between text-xs text-[#7A9B8D] mt-1">
              <span>1:20</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
          <Volume2 className="w-5 h-5 text-[#7A9B8D]" />
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <article className="prose prose-green max-w-none">
          <div className="space-y-4 text-[#1A3C2F] leading-relaxed">
            {lesson.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-xl font-bold text-[#1A3C2F] mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-lg font-semibold text-[#1A3C2F] mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold text-[#1A3C2F]">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              return (
                <p key={i} className="text-[#4A6B5D]">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Complete Button */}
        <div className="mt-8 pb-8">
          <button
            onClick={handleComplete}
            className="btn-primary w-full flex items-center justify-center gap-2"
            data-testid="lesson-complete"
          >
            <Check className="w-5 h-5" />
            <span>Mark as Complete</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
