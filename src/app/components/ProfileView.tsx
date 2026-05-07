import { useState } from 'react';
import { LogOut, User, Target, MapPin, Briefcase, GraduationCap, Edit2, Save, X } from 'lucide-react';

interface ProfileViewProps {
  profile: any;
  onUpdate: (updates: any) => void;
  onLogout: () => void;
}

const personalities = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Zeta', 'Sigma', 'Omega'];

export function ProfileView({ profile, onUpdate, onLogout }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setEditing(false);
  };

  const getPersonalityEmoji = (personality: string) => {
    const emojis: Record<string, string> = {
      Alpha: '🦁',
      Beta: '🤝',
      Gamma: '🎯',
      Delta: '🌊',
      Zeta: '🎨',
      Sigma: '🗿',
      Omega: '🧠',
    };
    return emojis[personality] || '⭐';
  };

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-4xl mb-3">
          {getPersonalityEmoji(profile.personality)}
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
        <p className="text-white/80 text-sm mb-2">{profile.email}</p>
        <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full">
          <span className="text-white font-semibold">{profile.personality} Personality</span>
        </div>
      </div>

      {/* Profile details */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>

        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/80 text-xs mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => updateField('age', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div>
                <label className="block text-white/80 text-xs mb-1">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-1">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation || ''}
                onChange={(e) => updateField('occupation', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-1">Primary Goal</label>
              <input
                type="text"
                value={formData.goal || ''}
                onChange={(e) => updateField('goal', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-1">Hobbies/Interests</label>
              <input
                type="text"
                value={formData.hobbies || ''}
                onChange={(e) => updateField('hobbies', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs mb-1">Personality Type</label>
              <select
                value={formData.personality || 'Beta'}
                onChange={(e) => updateField('personality', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {personalities.map((p) => (
                  <option key={p} value={p}>
                    {getPersonalityEmoji(p)} {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 bg-white/20 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {profile.age && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-xs text-white/60">Age</div>
                  <div className="text-white">{profile.age} years old</div>
                </div>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-xs text-white/60">Location</div>
                  <div className="text-white">{profile.location}</div>
                </div>
              </div>
            )}

            {profile.occupation && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-xs text-white/60">Occupation</div>
                  <div className="text-white">{profile.occupation}</div>
                </div>
              </div>
            )}

            {profile.education && (
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-xs text-white/60">Education</div>
                  <div className="text-white">{profile.education}</div>
                </div>
              </div>
            )}

            {profile.goal && (
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-xs text-white/60">Primary Goal</div>
                  <div className="text-white">{profile.goal}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Account Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Member Since</span>
            <span className="text-white">
              {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Current Aura</span>
            <span className="text-yellow-300 font-bold">{profile.aura}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 bg-red-500/20 text-red-300 font-semibold rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
