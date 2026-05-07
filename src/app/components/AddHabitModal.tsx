import { useState } from 'react';
import { X, Sparkles, Dumbbell, Book, Code, Coffee, Heart, Music, Palette, Brain } from 'lucide-react';

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: (habit: any) => void;
  profile: any;
}

const suggestedHabits = [
  { icon: Dumbbell, name: 'Morning Exercise', description: '30 min workout', category: 'fitness' },
  { icon: Book, name: 'Read 10 Pages', description: 'Daily reading', category: 'learning' },
  { icon: Code, name: 'Code Practice', description: '1 hour coding', category: 'skill' },
  { icon: Coffee, name: 'Drink Water', description: '8 glasses daily', category: 'health' },
  { icon: Heart, name: 'Meditation', description: '10 min mindfulness', category: 'wellness' },
  { icon: Music, name: 'Practice Music', description: '30 min practice', category: 'hobby' },
  { icon: Palette, name: 'Creative Work', description: 'Draw or design', category: 'hobby' },
  { icon: Brain, name: 'Learn New Skill', description: 'Daily learning', category: 'learning' },
];

export function AddHabitModal({ onClose, onAdd, profile }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [targetAmount, setTargetAmount] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      description,
      frequency,
      targetAmount: targetAmount ? parseInt(targetAmount) : undefined,
    });
  };

  const selectSuggestion = (habit: any) => {
    setName(habit.name);
    setDescription(habit.description);
    setShowSuggestions(false);
  };

  const getAISuggestions = () => {
    const { goal, hobbies, occupation, age } = profile;
    const suggestions = [];

    if (goal?.toLowerCase().includes('fit')) {
      suggestions.push('Build discipline through physical training');
    }
    if (occupation?.toLowerCase().includes('engineer') || occupation?.toLowerCase().includes('developer')) {
      suggestions.push('Level up your tech stack daily');
    }
    if (parseInt(age) < 30) {
      suggestions.push('Foundation phase: Lock in the basics');
    }
    if (hobbies?.toLowerCase().includes('read')) {
      suggestions.push('Knowledge compounds. Read every day');
    }

    return suggestions.length > 0 ? suggestions : ['Start with consistency over intensity', 'Focus on showing up every day'];
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#0E0E11] border border-[#24242B] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#0E0E11] px-6 py-5 flex items-center justify-between border-b border-[#24242B]">
          <h2 className="text-2xl font-bold text-[#F5F5F7]">Add New Habit</h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#F5F5F7] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-[#151519] border border-[#24242B] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-bold text-[#F5F5F7]">AI Suggestions</h3>
              </div>
              <div className="space-y-2 mb-4">
                {getAISuggestions().map((suggestion, idx) => (
                  <p key={idx} className="text-sm text-[#9CA3AF] leading-relaxed">• {suggestion}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {suggestedHabits.slice(0, 4).map((habit, idx) => {
                  const Icon = habit.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(habit)}
                      className="bg-[#0E0E11] border border-[#24242B] hover:border-[#8B5CF6]/50 rounded-xl p-3 text-left transition-all"
                    >
                      <Icon className="w-5 h-5 text-[#8B5CF6] mb-2" />
                      <div className="text-sm font-semibold text-[#F5F5F7] mb-0.5">{habit.name}</div>
                      <div className="text-xs text-[#9CA3AF]">{habit.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom habit form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm font-bold mb-2 uppercase tracking-wide">
                Habit Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#151519] border border-[#24242B] text-[#F5F5F7] placeholder-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-sm font-bold mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#151519] border border-[#24242B] text-[#F5F5F7] placeholder-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all min-h-24 resize-none"
                placeholder="What does this habit involve?"
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-sm font-bold mb-2 uppercase tracking-wide">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#151519] border border-[#24242B] text-[#F5F5F7] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-sm font-bold mb-2 uppercase tracking-wide">
                Target Amount (optional)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#151519] border border-[#24242B] text-[#F5F5F7] placeholder-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 transition-all"
                placeholder="e.g., 30 (minutes)"
              />
              <p className="text-xs text-[#9CA3AF] mt-2">
                For "Double down" feature — will do 2x this amount
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/50 hover:shadow-xl hover:shadow-[#8B5CF6]/60 transition-all hover:scale-[1.02]"
            >
              Add Habit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
