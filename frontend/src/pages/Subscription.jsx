import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Crown, Shield, Download, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useStore';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function Subscription() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isPremium = useUserStore((state) => state.isPremium);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/subscriptions/plans`);
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to subscribe');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/subscriptions/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan_id: selectedPlan,
          origin_url: window.location.origin
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to start checkout');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isPremium()) {
    return (
      <div className="page-scroll p-6 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 rounded-full bg-[#F4D35E] flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-[#3E3208]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A3C2F] mb-2">You're Premium!</h1>
          <p className="text-[#4A6B5D] mb-8">Thank you for supporting BreatheEasy</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const features = [
    { icon: Crown, text: 'Full courses access' },
    { icon: Shield, text: 'Night panic support' },
    { icon: Download, text: 'Offline access' },
    { icon: BarChart3, text: 'Personalized insights' }
  ];

  return (
    <div className="page-scroll safe-top">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          data-testid="subscription-back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1A3C2F]" />
        </button>
        <h1 className="text-xl font-bold text-[#1A3C2F]">Premium</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-8"
      >
        {/* Hero */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D35E] flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#3E3208]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A3C2F] mb-2">Unlock Your Full Potential</h2>
          <p className="text-[#4A6B5D]">Get access to all features and start your healing journey</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-[#76B992]" />
              </div>
              <span className="text-sm font-medium text-[#1A3C2F]">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan) => (
            <button
              key={plan.plan_id}
              onClick={() => setSelectedPlan(plan.plan_id)}
              className={`w-full card p-5 text-left transition-all ${
                selectedPlan === plan.plan_id
                  ? 'ring-2 ring-[#A8D5BA] bg-[#E8F5E9]/50'
                  : ''
              }`}
              data-testid={`plan-${plan.plan_id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#1A3C2F]">{plan.name}</h3>
                  <p className="text-sm text-[#7A9B8D]">Billed {plan.interval}ly</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#1A3C2F]">${plan.price}</span>
                  <span className="text-sm text-[#7A9B8D]">/{plan.interval}</span>
                </div>
              </div>
              
              {plan.plan_id === 'yearly' && (
                <span className="inline-block px-2 py-1 bg-[#F4D35E] text-[#3E3208] text-xs font-bold rounded-full">
                  Save 33%
                </span>
              )}

              <div className="mt-4 space-y-2">
                {plan.features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#4A6B5D]">
                    <Check className="w-4 h-4 text-[#76B992]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          className="btn-primary w-full"
          disabled={loading}
          data-testid="subscribe-btn"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>

        <p className="text-xs text-center text-[#7A9B8D]">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </motion.div>
    </div>
  );
}
