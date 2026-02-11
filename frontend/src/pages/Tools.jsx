import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Anchor, Moon, Music, Brain, Timer, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '@/store/useStore';
import { SEOHead } from '@/components/SEOHead';

const tools = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Calm your nervous system',
    icon: Wind,
    color: 'bg-[#A8D5BA]',
    presets: ['60s Quick', '2m Steady', '5m Deep']
  },
  {
    id: 'grounding',
    title: 'Grounding Exercises',
    description: '5-4-3-2-1 technique',
    icon: Anchor,
    color: 'bg-[#BCE3E1]'
  },
  {
    id: 'night-panic',
    title: 'Night Panic Support',
    description: 'For panic at night',
    icon: Moon,
    color: 'bg-[#D4B8E0]',
    isPremium: true
  },
  {
    id: 'quick-calm',
    title: 'Quick Calm Audio',
    description: 'Soothing sounds',
    icon: Music,
    color: 'bg-[#F4D35E]'
  },
  {
    id: 'thought-defusion',
    title: 'Thought Defusion',
    description: 'Detach from worries',
    icon: Brain,
    color: 'bg-[#E8A598]',
    isPremium: true
  }
];

export default function Tools() {
  const navigate = useNavigate();
  const defaultPreset = useSettingsStore((state) => state.defaultBreathingPreset);
  const setBreathingPreset = useSettingsStore((state) => state.setBreathingPreset);

  const handleToolClick = (tool) => {
    if (tool.id === 'breathing') {
      navigate('/emergency/breathing');
    } else if (tool.id === 'grounding') {
      navigate('/emergency/grounding');
    } else {
      // For premium tools, show subscription page
      if (tool.isPremium) {
        navigate('/subscription');
      }
    }
  };

  return (
    <>
      <SEOHead page="tools" />
      <div className="page-scroll p-6 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-[#1A3C2F]" data-testid="tools-title">
            Tools
          </h1>
          <p className="text-[#4A6B5D] mt-1">Reusable calming techniques</p>
        </div>

        {/* Breathing Presets */}
        <div className="card p-5">
          <h2 className="font-semibold text-[#1A3C2F] mb-3 flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#76B992]" />
            Breathing Presets
          </h2>
          <div className="flex gap-2">
            {[
              { id: '60s', label: '60s Quick' },
              { id: '2m', label: '2m Steady' },
              { id: '5m', label: '5m Deep' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setBreathingPreset(preset.id)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                  defaultPreset === preset.id
                    ? 'bg-[#A8D5BA] text-[#1A3C2F]'
                    : 'bg-[#E8F5E9] text-[#4A6B5D] hover:bg-[#D4EBE0]'
                }`}
                data-testid={`preset-${preset.id}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleToolClick(tool)}
              className="tool-card relative"
              data-testid={`tool-${tool.id}`}
            >
              {tool.isPremium && (
                <span className="premium-badge absolute top-2 right-2 text-xs">
                  Premium
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center`}>
                <tool.icon className="w-6 h-6 text-[#1A3C2F]" />
              </div>
              <h3 className="font-semibold text-[#1A3C2F] text-sm text-center">{tool.title}</h3>
              <p className="text-xs text-[#7A9B8D] text-center">{tool.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Audio Section */}
        <div className="card p-5">
          <h2 className="font-semibold text-[#1A3C2F] mb-3 flex items-center gap-2">
            <Music className="w-5 h-5 text-[#76B992]" />
            Calming Sounds
          </h2>
          <div className="space-y-3">
            {['Soft Rain', 'Ocean Waves', 'Gentle White Noise'].map((sound) => (
              <button
                key={sound}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#E8F5E9] hover:bg-[#D4EBE0] transition-all"
                data-testid={`sound-${sound.toLowerCase().replace(' ', '-')}`}
              >
                <span className="text-[#1A3C2F] font-medium">{sound}</span>
                <ChevronRight className="w-5 h-5 text-[#7A9B8D]" />
              </button>
            ))}
          </div>
          <p className="text-xs text-[#7A9B8D] mt-3">
            Audio player coming soon. Sounds will play during exercises.
          </p>
        </div>

        {/* SEO Footer Links */}
        <div className="pt-4 pb-20 border-t border-[#E8F5E9]">
          <p className="text-xs text-[#7A9B8D] mb-3">Explore more:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/panic-attack-help" className="text-xs text-[#76B992] hover:underline">
              Panic Attack Help
            </Link>
            <Link to="/breathing-exercise" className="text-xs text-[#76B992] hover:underline">
              Breathing Exercises Guide
            </Link>
            <Link to="/anxiety-tools" className="text-xs text-[#76B992] hover:underline">
              All Anxiety Tools
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
}
