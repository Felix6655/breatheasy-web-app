import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Wind, Clock, Heart, ArrowRight, Play } from 'lucide-react';

export default function BreathingExercise() {
  return (
    <>
      <SEOHead page="breathingExercise" />
      
      <div className="min-h-screen bg-[#F7FBF9] pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#E8F5E9] to-[#F7FBF9] px-6 pt-12 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-[#76B992] mb-4">
              <Wind className="w-5 h-5" />
              <span className="text-sm font-medium">Breathing Techniques</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3C2F] mb-4">
              Breathing Exercises for Anxiety & Panic Relief
            </h1>
            
            <p className="text-lg text-[#4A6B5D] mb-6">
              Learn breathing techniques that actually work for calming anxiety and stopping panic attacks. 
              Simple, effective, and backed by science.
            </p>
            
            <Link 
              to="/emergency/breathing"
              className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-6 py-3 hover:bg-[#8FC7A6] transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Start breathing exercise</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Why Breathing Works for Anxiety
              </h2>
              <p className="text-[#4A6B5D] mb-4">
                When you're anxious, your breathing becomes fast and shallow. This triggers more anxiety 
                in a cycle. Slow, controlled breathing activates your parasympathetic nervous system—the 
                part of your body responsible for rest and calm.
              </p>
              <p className="text-[#4A6B5D]">
                <strong className="text-[#1A3C2F]">The key:</strong> Your exhale should be longer than 
                your inhale. This tells your body it's safe to relax.
              </p>
            </section>

            {/* Technique 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                The 4-6 Breathing Technique
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#1A3C2F]">4-6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C2F]">Best for panic attacks</h3>
                    <p className="text-sm text-[#7A9B8D]">Our recommended technique</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992]">1</div>
                    <p className="text-[#4A6B5D]"><strong>Inhale slowly for 4 seconds</strong> through your nose</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992]">2</div>
                    <p className="text-[#4A6B5D]"><strong>Exhale slowly for 6 seconds</strong> through your mouth</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992]">3</div>
                    <p className="text-[#4A6B5D]"><strong>Repeat</strong> for 2-5 minutes or until you feel calmer</p>
                  </div>
                </div>
              </div>
              <p className="text-[#4A6B5D]">
                This is the technique we use in BreatheEasy's emergency panic support. The longer exhale 
                is scientifically proven to activate the vagus nerve and reduce heart rate.
              </p>
            </section>

            {/* Technique 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Box Breathing (4-4-4-4)
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#BCE3E1] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#1A3C2F] rounded"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C2F]">Used by Navy SEALs</h3>
                    <p className="text-sm text-[#7A9B8D]">Great for focus and stress</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[#4A6B5D]">
                  <li>• <strong>Inhale for 4 seconds</strong></li>
                  <li>• <strong>Hold for 4 seconds</strong></li>
                  <li>• <strong>Exhale for 4 seconds</strong></li>
                  <li>• <strong>Hold for 4 seconds</strong></li>
                  <li>• Repeat</li>
                </ul>
              </div>
              <p className="text-[#4A6B5D]">
                Box breathing is excellent for general stress and improving focus. 
                The equal timing creates a rhythm that's easy to follow.
              </p>
            </section>

            {/* Presets */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Breathing Exercise Presets
              </h2>
              <p className="text-[#4A6B5D] mb-6">
                Choose based on how much time you have and what you need:
              </p>
              
              <div className="grid gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E8F5E9]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#1A3C2F]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A3C2F]">60 Second Quick Calm</h3>
                        <p className="text-sm text-[#7A9B8D]">When you need fast relief</p>
                      </div>
                    </div>
                    <Link 
                      to="/tools"
                      className="text-[#76B992] font-medium hover:underline"
                    >
                      Try →
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 border border-[#E8F5E9]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#BCE3E1] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#1A3C2F]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A3C2F]">2 Minute Steady</h3>
                        <p className="text-sm text-[#7A9B8D]">Standard session length</p>
                      </div>
                    </div>
                    <Link 
                      to="/tools"
                      className="text-[#76B992] font-medium hover:underline"
                    >
                      Try →
                    </Link>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-5 border border-[#E8F5E9]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#F4D35E] flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#1A3C2F]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A3C2F]">5 Minute Deep</h3>
                        <p className="text-sm text-[#7A9B8D]">For deeper relaxation</p>
                      </div>
                    </div>
                    <Link 
                      to="/tools"
                      className="text-[#76B992] font-medium hover:underline"
                    >
                      Try →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Tips for Better Breathing
              </h2>
              <ul className="space-y-3 text-[#4A6B5D]">
                <li>
                  <strong className="text-[#1A3C2F]">Breathe from your belly:</strong> Your stomach 
                  should rise when you inhale, not your chest.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Find a comfortable position:</strong> Sitting 
                  or lying down works best. Relax your shoulders.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Close your eyes:</strong> This helps reduce 
                  external stimulation and focus inward.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Practice daily:</strong> Even 2 minutes a day 
                  builds your body's ability to calm down quickly.
                </li>
              </ul>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20 rounded-3xl p-8 text-center">
              <Heart className="w-10 h-10 text-[#76B992] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-2">
                Ready to Practice?
              </h2>
              <p className="text-[#4A6B5D] mb-6">
                Start a guided breathing session with visual cues and calming sounds.
              </p>
              <Link 
                to="/emergency/breathing"
                className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-8 py-4 text-lg hover:bg-[#8FC7A6] transition-colors"
              >
                <Play className="w-5 h-5" />
                Start breathing exercise
              </Link>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
