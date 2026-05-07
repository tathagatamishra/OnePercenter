import { useState } from 'react';
import { ChevronRight, User, Target, Calendar } from 'lucide-react';

interface OnboardingScreenProps {
  profile: any;
  onComplete: (updates: any) => void;
}

const personalities = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Zeta', 'Sigma', 'Omega'];

export function OnboardingScreen({ profile, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    occupation: '',
    goal: '',
    hobbies: '',
    location: '',
    education: '',
    maritalStatus: '',
    language: '',
    sleepPattern: '',
    healthLimitations: '',
    availableTime: '',
    currentHabits: '',
    personality: 'Beta',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      onboardingComplete: true,
    });
  };

  return (
    <div className="size-full min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm font-medium">Step {step} of 3</span>
              <span className="text-white/80 text-sm">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">About You</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="New York, USA"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateField('occupation', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => updateField('education', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Bachelor's Degree"
                />
              </div>
            </div>
          )}

          {/* Step 2: Goals & Lifestyle */}
          {step === 2 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">Goals & Lifestyle</h2>
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Primary Goal</label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => updateField('goal', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Get fit, learn coding, etc."
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Hobbies/Interests</label>
                <input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => updateField('hobbies', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Reading, gym, gaming"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Sleep Pattern</label>
                <input
                  type="text"
                  value={formData.sleepPattern}
                  onChange={(e) => updateField('sleepPattern', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="10 PM - 6 AM"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Available Time (hrs/day)</label>
                <input
                  type="text"
                  value={formData.availableTime}
                  onChange={(e) => updateField('availableTime', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="2-3 hours"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Current Habits</label>
                <textarea
                  value={formData.currentHabits}
                  onChange={(e) => updateField('currentHabits', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-20"
                  placeholder="Morning exercise, read daily..."
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-1.5">Health Limitations</label>
                <input
                  type="text"
                  value={formData.healthLimitations}
                  onChange={(e) => updateField('healthLimitations', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="None or list any"
                />
              </div>
            </div>
          )}

          {/* Step 3: Personality */}
          {step === 3 && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">Your Personality</h2>
              </div>

              <p className="text-white/80 text-sm">Choose your personality archetype:</p>

              <div className="grid grid-cols-2 gap-3">
                {personalities.map((p) => (
                  <button
                    key={p}
                    onClick={() => updateField('personality', p)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      formData.personality === p
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <p className="text-white/80 text-sm leading-relaxed">
                  {formData.personality === 'Alpha' && '🦁 Natural leader, dominant, confident'}
                  {formData.personality === 'Beta' && '🤝 Cooperative, friendly, supportive'}
                  {formData.personality === 'Gamma' && '🎯 Adventurous, fun-loving, spontaneous'}
                  {formData.personality === 'Delta' && '🌊 Calm, reserved, introspective'}
                  {formData.personality === 'Zeta' && '🎨 Creative, independent, visionary'}
                  {formData.personality === 'Sigma' && '🗿 Lone wolf, self-reliant, enigmatic'}
                  {formData.personality === 'Omega' && '🧠 Intellectual, innovative, unique'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3.5 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Start Journey
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
