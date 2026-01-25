import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useStore';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('checking'); // checking, success, error
  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const pollStatus = async (attempts = 0) => {
      if (attempts >= 5) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/subscriptions/status/${sessionId}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.payment_status === 'paid') {
            setStatus('success');
            // Refresh user data to get updated subscription status
            await checkAuth();
            return;
          } else if (data.status === 'expired') {
            setStatus('error');
            return;
          }
        }

        // Continue polling
        setTimeout(() => pollStatus(attempts + 1), 2000);
      } catch (error) {
        console.error('Error checking payment status:', error);
        setTimeout(() => pollStatus(attempts + 1), 2000);
      }
    };

    pollStatus();
  }, [sessionId, checkAuth]);

  return (
    <div className="min-h-screen bg-[#F7FBF9] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm"
      >
        {status === 'checking' && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-[#76B992] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A3C2F] mb-2">Processing Payment</h1>
            <p className="text-[#4A6B5D]">Please wait while we confirm your subscription...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-[#F4D35E] flex items-center justify-center mx-auto mb-6"
            >
              <Crown className="w-10 h-10 text-[#3E3208]" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#1A3C2F] mb-2">Welcome to Premium!</h1>
            <p className="text-[#4A6B5D] mb-8">
              Your subscription is now active. Enjoy full access to all courses and features.
            </p>
            
            <div className="card p-5 mb-6 text-left space-y-3">
              {['Full courses access', 'Night panic support', 'Offline access', 'Personalized insights'].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#76B992]" />
                  <span className="text-[#1A3C2F]">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full"
              data-testid="success-continue"
            >
              Start Exploring
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-[#FFE0E0] flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">😔</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A3C2F] mb-2">Something went wrong</h1>
            <p className="text-[#4A6B5D] mb-8">
              We couldn't confirm your payment. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/subscription')}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-ghost w-full"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
