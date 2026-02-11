import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Anchor, Wind, Moon, Music, Brain, Heart, ArrowRight } from 'lucide-react';

export default function AnxietyTools() {
  return (
    <>
      <SEOHead page="anxietyTools" />
      
      <div className="min-h-screen bg-[#F7FBF9] pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#E8F5E9] to-[#F7FBF9] px-6 pt-12 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-[#76B992] mb-4">
              <Anchor className="w-5 h-5" />
              <span className="text-sm font-medium">Anxiety Relief</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A3C2F] mb-4">
              Anxiety Tools & Techniques That Work
            </h1>
            
            <p className="text-lg text-[#4A6B5D] mb-6">
              Evidence-based tools for managing anxiety. From quick relief techniques to long-term 
              strategies, find what works for you.
            </p>
            
            <Link 
              to="/tools"
              className="inline-flex items-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-6 py-3 hover:bg-[#8FC7A6] transition-colors"
            >
              <span>Access all tools</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-12">
            
            {/* Tool 1: Grounding */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#BCE3E1] flex items-center justify-center">
                  <Anchor className="w-6 h-6 text-[#1A3C2F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A3C2F]">
                  5-4-3-2-1 Grounding Technique
                </h2>
              </div>
              
              <p className="text-[#4A6B5D] mb-4">
                The 5-4-3-2-1 technique is one of the most effective ways to pull yourself out of 
                anxious thoughts and back into the present moment. It works by engaging all five senses.
              </p>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <h3 className="font-semibold text-[#1A3C2F] mb-4">How to do it:</h3>
                <ul className="space-y-3 text-[#4A6B5D]">
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992] flex-shrink-0">5</span>
                    <span><strong>See:</strong> Name 5 things you can see around you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992] flex-shrink-0">4</span>
                    <span><strong>Touch:</strong> Name 4 things you can physically feel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992] flex-shrink-0">3</span>
                    <span><strong>Hear:</strong> Name 3 sounds you can hear</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992] flex-shrink-0">2</span>
                    <span><strong>Smell:</strong> Name 2 things you can smell</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center font-bold text-[#76B992] flex-shrink-0">1</span>
                    <span><strong>Taste:</strong> Name 1 thing you can taste</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-[#4A6B5D]">
                <strong className="text-[#1A3C2F]">Why it works:</strong> Anxiety often pulls us into 
                worried thoughts about the future. This technique anchors you firmly in the present, 
                where you are safe.
              </p>
              
              <Link 
                to="/emergency/grounding"
                className="inline-flex items-center gap-2 text-[#76B992] font-medium mt-4 hover:underline"
              >
                Try guided grounding exercise →
              </Link>
            </section>

            {/* Tool 2: Breathing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#A8D5BA] flex items-center justify-center">
                  <Wind className="w-6 h-6 text-[#1A3C2F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A3C2F]">
                  Controlled Breathing
                </h2>
              </div>
              
              <p className="text-[#4A6B5D] mb-4">
                Your breath is the fastest way to change your nervous system state. 
                Slow, controlled breathing with a longer exhale activates your body's natural calming response.
              </p>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9] mb-4">
                <h3 className="font-semibold text-[#1A3C2F] mb-3">Quick technique:</h3>
                <p className="text-[#4A6B5D]">
                  <strong>Inhale 4 seconds → Exhale 6 seconds</strong><br/>
                  Repeat for 2 minutes minimum.
                </p>
              </div>
              
              <Link 
                to="/breathing-exercise"
                className="inline-flex items-center gap-2 text-[#76B992] font-medium hover:underline"
              >
                Learn more breathing techniques →
              </Link>
            </section>

            {/* Tool 3: Night Panic */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4B8E0] flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[#1A3C2F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A3C2F]">
                  Night Panic Support
                </h2>
              </div>
              
              <p className="text-[#4A6B5D] mb-4">
                Waking up with anxiety or panic at night can be particularly frightening because 
                you're disoriented and alone. Having a plan makes all the difference.
              </p>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9]">
                <h3 className="font-semibold text-[#1A3C2F] mb-3">When panic wakes you:</h3>
                <ul className="space-y-2 text-[#4A6B5D]">
                  <li>• Turn on a soft light (darkness increases fear)</li>
                  <li>• Sit up slowly and put your feet on the floor</li>
                  <li>• Start slow breathing: 4 in, 6 out</li>
                  <li>• Remind yourself: "I'm safe. This will pass."</li>
                  <li>• Use the BreatheEasy app for guided support</li>
                </ul>
              </div>
            </section>

            {/* Tool 4: Calming Sounds */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4D35E] flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#1A3C2F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A3C2F]">
                  Calming Sounds
                </h2>
              </div>
              
              <p className="text-[#4A6B5D] mb-4">
                Ambient sounds can mask anxious thoughts and create a calming environment. 
                Nature sounds are particularly effective because they signal safety to our brains.
              </p>
              
              <div className="grid gap-3">
                <div className="bg-white rounded-xl p-4 border border-[#E8F5E9] flex items-center gap-3">
                  <span className="text-2xl">🌧️</span>
                  <div>
                    <h4 className="font-medium text-[#1A3C2F]">Soft Rain</h4>
                    <p className="text-sm text-[#7A9B8D]">Gentle, consistent background</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E8F5E9] flex items-center gap-3">
                  <span className="text-2xl">🌊</span>
                  <div>
                    <h4 className="font-medium text-[#1A3C2F]">Ocean Waves</h4>
                    <p className="text-sm text-[#7A9B8D]">Rhythmic and soothing</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#E8F5E9] flex items-center gap-3">
                  <span className="text-2xl">☁️</span>
                  <div>
                    <h4 className="font-medium text-[#1A3C2F]">White Noise</h4>
                    <p className="text-sm text-[#7A9B8D]">Blocks distracting thoughts</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/tools"
                className="inline-flex items-center gap-2 text-[#76B992] font-medium mt-4 hover:underline"
              >
                Listen to calming sounds →
              </Link>
            </section>

            {/* Tool 5: Thought Defusion */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#E8A598] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#1A3C2F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1A3C2F]">
                  Thought Defusion
                </h2>
              </div>
              
              <p className="text-[#4A6B5D] mb-4">
                When anxious thoughts won't stop, thought defusion helps you step back and see them 
                as just thoughts—not facts. This reduces their power over you.
              </p>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F5E9]">
                <h3 className="font-semibold text-[#1A3C2F] mb-3">Try this technique:</h3>
                <p className="text-[#4A6B5D] mb-3">
                  When you have an anxious thought, add "I notice I'm having the thought that..." 
                  before it.
                </p>
                <p className="text-[#4A6B5D] italic">
                  Instead of: "Something terrible is going to happen"<br/>
                  Say: "I notice I'm having the thought that something terrible is going to happen"
                </p>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-[#A8D5BA]/20 to-[#BCE3E1]/20 rounded-3xl p-8 text-center">
              <Heart className="w-10 h-10 text-[#76B992] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-2">
                All Tools in One Place
              </h2>
              <p className="text-[#4A6B5D] mb-6">
                Access breathing exercises, grounding, calming sounds, and more—all designed for anxious moments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/tools"
                  className="inline-flex items-center justify-center gap-2 bg-[#A8D5BA] text-[#1A3C2F] font-bold rounded-full px-6 py-3 hover:bg-[#8FC7A6] transition-colors"
                >
                  View all tools
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/help-now"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1A3C2F] font-bold rounded-full px-6 py-3 border-2 border-[#A8D5BA] hover:bg-[#E8F5E9] transition-colors"
                >
                  Need help now?
                </Link>
              </div>
            </section>

            {/* Learn More */}
            <section>
              <h2 className="text-2xl font-bold text-[#1A3C2F] mb-4">
                Learn More About Anxiety
              </h2>
              <p className="text-[#4A6B5D] mb-6">
                Understanding anxiety is the first step to managing it. Our courses teach you 
                evidence-based techniques and help you build lasting confidence.
              </p>
              <Link 
                to="/courses"
                className="inline-flex items-center gap-2 text-[#76B992] font-medium hover:underline"
              >
                Explore anxiety courses →
              </Link>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
