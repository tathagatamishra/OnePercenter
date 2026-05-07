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
      suggestions.push('Try "Morning Yoga" or "Evening Walk"');
    }
    if (occupation?.toLowerCase().includes('engineer') || occupation?.toLowerCase().includes('developer')) {
      suggestions.push('Consider "Learn New Tech" or "Code Review"');
    }
    if (parseInt(age) < 30) {
      suggestions.push('Build foundational habits like "Sleep 8 hours"');
    }
    if (hobbies?.toLowerCase().includes('read')) {
      suggestions.push('Set "Read Daily" with specific page goals');
    }

    return suggestions.length > 0 ? suggestions : ['Start with basic health habits', 'Focus on consistency over intensity'];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Add New Habit</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="font-semibold text-white">AI Suggestions for You</h3>
              </div>
              <div className="space-y-2 mb-3">
                {getAISuggestions().map((suggestion, idx) => (
                  <p key={idx} className="text-sm text-white/80">• {suggestion}</p>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {suggestedHabits.slice(0, 4).map((habit, idx) => {
                  const Icon = habit.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(habit)}
                      className="bg-white/10 hover:bg-white/20 rounded-xl p-3 text-left transition-all"
                    >
                      <Icon className="w-5 h-5 text-yellow-300 mb-1" />
                      <div className="text-sm font-medium text-white">{habit.name}</div>
                      <div className="text-xs text-white/60">{habit.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom habit form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Habit Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-20"
                placeholder="What does this habit involve?"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-1.5">
                Target Amount (optional)
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., 30 (minutes)"
              />
              <p className="text-xs text-white/60 mt-1">
                For "Double down" feature - will do 2x this amount
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Add Habit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
