import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Heart, Wind, Anchor, BookOpen, ArrowRight } from 'lucide-react';

export default function PanicAttackHelp() {
  return (
    <>
      <SEOHead page="panicAttackHelp" />
      
      <div className="min-h-screen bg-[#F7FBF9] pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#E8F5E9] to-[#F7FBF9] px-6 pt-12 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-[#76B992] mb-4">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">You're safe here</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3C2F] mb-4">
              Panic Attack Help: What to Do Right Now
            </h1>
            
            <p className="text-lg text-[#4A6B5D] mb-6">
              If you're having a panic attack, you're not alone. This feeling will pass. 
              Here's what you need to know and do.
            </p>
            
            <Link 
              to="/help-now"
              className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-6 py-3 hover:bg-[#8FC7A6] transition-colors"
            >
              <span>I need help now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                What Is a Panic Attack?
              </h2>
              <p className="text-[#4A6B5D] mb-4">
                A panic attack is your body's "fight or flight" response activating when there's no real danger. 
                It's like a false alarm in your nervous system. The sensations feel intense, but they are not dangerous.
              </p>
              <p className="text-[#4A6B5D]">
                <strong className="text-[#1A3C2F]">Key fact:</strong> Panic attacks typically peak within 10 minutes 
                and rarely last more than 30 minutes. Your body cannot maintain this state forever.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Step 1: Slow Your Breathing
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#A8D5BA] flex items-center justify-center">
                    <Wind className="w-6 h-6 text-[#1A3C2F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C2F]">4-6 Breathing Technique</h3>
                    <p className="text-sm text-[#7A9B8D]">The most effective breathing for panic</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[#4A6B5D]">
                  <li>• <strong>Inhale slowly for 4 seconds</strong> through your nose</li>
                  <li>• <strong>Exhale slowly for 6 seconds</strong> through your mouth</li>
                  <li>• Repeat for 2-5 minutes</li>
                </ul>
              </div>
              <p className="text-[#4A6B5D]">
                The longer exhale activates your parasympathetic nervous system, which calms your body naturally.
              </p>
              <Link 
                to="/tools"
                className="inline-flex items-center gap-2 text-[#76B992] font-medium mt-4 hover:underline"
              >
                Try guided breathing exercise →
              </Link>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Step 2: Ground Yourself (5-4-3-2-1)
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#BCE3E1] flex items-center justify-center">
                    <Anchor className="w-6 h-6 text-[#1A3C2F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C2F]">5-4-3-2-1 Grounding</h3>
                    <p className="text-sm text-[#7A9B8D]">Brings you back to the present moment</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[#4A6B5D]">
                  <li>• Name <strong>5 things</strong> you can see</li>
                  <li>• Name <strong>4 things</strong> you can touch</li>
                  <li>• Name <strong>3 things</strong> you can hear</li>
                  <li>• Name <strong>2 things</strong> you can smell</li>
                  <li>• Name <strong>1 thing</strong> you can taste</li>
                </ul>
              </div>
              <p className="text-[#4A6B5D]">
                This technique shifts your focus from internal panic sensations to the safe external world around you.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Why Panic Attacks Are Not Dangerous
              </h2>
              <p className="text-[#4A6B5D] mb-4">
                Even though panic feels terrifying, the symptoms are your body's normal stress response:
              </p>
              <ul className="space-y-3 text-[#4A6B5D]">
                <li>
                  <strong className="text-[#1A3C2F]">Racing heart:</strong> Your heart is strong. 
                  It's designed to speed up during stress.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Shortness of breath:</strong> You're actually 
                  breathing faster, not less. You're getting plenty of oxygen.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Dizziness:</strong> Caused by rapid breathing 
                  changing CO2 levels. Uncomfortable but not dangerous.
                </li>
                <li>
                  <strong className="text-[#1A3C2F]">Chest tightness:</strong> Muscle tension, 
                  not a heart attack.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Learn to Prevent Future Panic Attacks
              </h2>
              <p className="text-[#4A6B5D] mb-4">
                Understanding panic is the first step to reducing its power over you. 
                Our courses teach you:
              </p>
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#F4D35E] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#1A3C2F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A3C2F]">Panic Attack Courses</h3>
                    <p className="text-sm text-[#7A9B8D]">Build confidence over time</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[#4A6B5D] mb-4">
                  <li>• What triggers panic attacks</li>
                  <li>• How to reduce fear of symptoms</li>
                  <li>• Building a personal panic plan</li>
                  <li>• Handling panic in public</li>
                </ul>
                <Link 
                  to="/courses"
                  className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-6 py-3 hover:bg-[#8FC7A6] transition-colors"
                >
                  View courses
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-2">
                Need Help Right Now?
              </h2>
              <p className="text-[#4A6B5D] mb-6">
                Our guided emergency support walks you through calming down step by step.
              </p>
              <Link 
                to="/help-now"
                className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-8 py-4 text-lg hover:bg-[#8FC7A6] transition-colors"
              >
                Start calming now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
