import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { Home, Plus, BarChart3, User, LogOut, Flame, Trophy, Target, Timer, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { HabitsList } from './HabitsList';
import { AddHabitModal } from './AddHabitModal';
import { AnalyticsView } from './AnalyticsView';
import { ProfileView } from './ProfileView';
import { toast } from 'sonner';

interface DashboardProps {
  profile: any;
  accessToken: string;
  onLogout: () => void;
  onProfileUpdate: (updates: any) => void;
}

export function Dashboard({ profile, accessToken, onLogout, onProfileUpdate }: DashboardProps) {
  const [currentTab, setCurrentTab] = useState<'home' | 'analytics' | 'profile'>('home');
  const [habits, setHabits] = useState<any[]>([]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/habits`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.habits) {
        setHabits(data.habits);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData: any) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/habits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitData),
      });

      const data = await response.json();
      if (data.habit) {
        setHabits([...habits, data.habit]);
        setShowAddHabit(false);
        toast.success('Habit added!');
      }
    } catch (error) {
      console.error('Error adding habit:', error);
      toast.error('Failed to add habit');
    }
  };

  const completeHabit = async (habitId: string, duration?: number) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: new Date().toISOString(), duration }),
      });

      const data = await response.json();
      if (data.habit) {
        setHabits(habits.map((h) => (h.id === habitId ? data.habit : h)));

        // Gain aura for completing habit
        await updateAura(5, 'Completed habit: ' + data.habit.name);
        toast.success(`+5 Aura! Streak: ${data.habit.streak} days`);
      }
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setHabits(habits.filter((h) => h.id !== habitId));
        toast.success('Habit deleted');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const updateAura = async (amount: number, reason: string) => {
    try {
      const endpoint = amount > 0 ? 'gain' : 'lose';
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/aura/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Math.abs(amount), reason }),
      });

      const data = await response.json();
      if (data.profile) {
        onProfileUpdate(data.profile);
      }
    } catch (error) {
      console.error('Error updating aura:', error);
    }
  };

  const handleAuraLoss = async (habitName: string) => {
    await updateAura(-10, `Failed to maintain: ${habitName}`);
    toast.error('-10 Aura! Keep going!');
  };

  const handleAllOrNothing = async (habitId: string, success: boolean) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (success) {
      await updateAura(20, `All or Nothing success: ${habit.name}`);
      toast.success('+20 Aura! All or Nothing completed!');
    } else {
      await updateAura(-20, `All or Nothing failed: ${habit.name}`);
      toast.error('-20 Aura! All or Nothing failed!');
    }
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

  const getAuraLevel = (aura: number) => {
    if (aura >= 500) return { label: 'Legendary', color: 'from-yellow-400 to-orange-500' };
    if (aura >= 300) return { label: 'Elite', color: 'from-purple-400 to-pink-500' };
    if (aura >= 150) return { label: 'Rising', color: 'from-blue-400 to-cyan-500' };
    if (aura >= 50) return { label: 'Building', color: 'from-green-400 to-emerald-500' };
    return { label: 'Starting', color: 'from-gray-400 to-slate-500' };
  };

  const auraLevel = getAuraLevel(profile.aura);

  return (
    <div className="size-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">OnePercenter</h1>
            <p className="text-sm text-white/80">
              {getPersonalityEmoji(profile.personality)} {profile.personality}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Flame className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl font-bold text-white">{profile.aura}</span>
            </div>
            <span className={`text-xs font-semibold bg-gradient-to-r ${auraLevel.color} bg-clip-text text-transparent`}>
              {auraLevel.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {currentTab === 'home' && (
          <div className="px-6 py-4">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                <Trophy className="w-5 h-5 text-yellow-300 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{habits.length}</div>
                <div className="text-xs text-white/70">Habits</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                <Target className="w-5 h-5 text-green-300 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {habits.filter(h => h.status === 'active').length}
                </div>
                <div className="text-xs text-white/70">Active</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center">
                <Zap className="w-5 h-5 text-orange-300 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">
                  {Math.max(...habits.map(h => h.streak || 0), 0)}
                </div>
                <div className="text-xs text-white/70">Best Streak</div>
              </div>
            </div>

            {/* Habits list */}
            {loading ? (
              <div className="text-center text-white/60 py-8">Loading habits...</div>
            ) : (
              <HabitsList
                habits={habits}
                onComplete={completeHabit}
                onDelete={deleteHabit}
                onAuraLoss={handleAuraLoss}
                onAllOrNothing={handleAllOrNothing}
              />
            )}
          </div>
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView accessToken={accessToken} habits={habits} profile={profile} />
        )}

        {currentTab === 'profile' && (
          <ProfileView profile={profile} onUpdate={onProfileUpdate} onLogout={onLogout} />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'home' ? 'text-yellow-300 scale-110' : 'text-white/60'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setShowAddHabit(true)}
            className="flex flex-col items-center gap-1 text-yellow-300 scale-125 -mt-2"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'analytics' ? 'text-yellow-300 scale-110' : 'text-white/60'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Stats</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'profile' ? 'text-yellow-300 scale-110' : 'text-white/60'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Add habit modal */}
      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onAdd={addHabit}
          profile={profile}
        />
      )}
    </div>
  );
}
