import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { Home, Plus, BarChart3, User, Flame, Trophy, Target, Zap } from 'lucide-react';
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
        toast.success(`Aura gained +5 | Streak: ${data.habit.streak} days`);
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
    toast.error('You folded. -10 Aura');
  };

  const handleAllOrNothing = async (habitId: string, success: boolean) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (success) {
      await updateAura(20, `All or Nothing success: ${habit.name}`);
      toast.success('Locked in! +20 Aura');
    } else {
      await updateAura(-20, `All or Nothing failed: ${habit.name}`);
      toast.error('You folded hard. -20 Aura');
    }
  };

  const getRank = (aura: number) => {
    if (aura >= 5000) return { label: 'Omega', emoji: '🧠', gradient: 'from-[#F59E0B] via-[#EF4444] to-[#8B5CF6]' };
    if (aura >= 1500) return { label: 'Sigma', emoji: '🗿', gradient: 'from-[#8B5CF6] to-[#06B6D4]' };
    if (aura >= 500) return { label: 'Gamma', emoji: '🎯', gradient: 'from-[#06B6D4] to-[#22C55E]' };
    if (aura >= 100) return { label: 'Beta', emoji: '🤝', gradient: 'from-[#22C55E] to-[#F59E0B]' };
    return { label: 'NPC', emoji: '😶', gradient: 'from-[#9CA3AF] to-[#6B7280]' };
  };

  const rank = getRank(profile.aura);

  return (
    <div className="size-full min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[120px] opacity-10" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-[#06B6D4] rounded-full blur-[120px] opacity-10" />

      {/* Header */}
      <div className="relative z-10 bg-[#0E0E11] border-b border-[#24242B] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F5F5F7] tracking-tight">OnePercenter</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{rank.emoji}</span>
              <span className={`text-sm font-bold bg-gradient-to-r ${rank.gradient} bg-clip-text text-transparent`}>
                {rank.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <Flame className="w-6 h-6 text-[#F59E0B]" />
              <span className="text-3xl font-bold text-[#F5F5F7] tabular-nums">{profile.aura}</span>
            </div>
            <span className="text-xs text-[#9CA3AF] uppercase tracking-wider">Aura Points</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20 relative z-10">
        {currentTab === 'home' && (
          <div className="px-6 py-4">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#151519] border border-[#24242B] rounded-2xl p-4 text-center hover:border-[#8B5CF6]/50 transition-all">
                <Trophy className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#F5F5F7]">{habits.length}</div>
                <div className="text-xs text-[#9CA3AF] uppercase tracking-wide">Habits</div>
              </div>
              <div className="bg-[#151519] border border-[#24242B] rounded-2xl p-4 text-center hover:border-[#22C55E]/50 transition-all">
                <Target className="w-6 h-6 text-[#22C55E] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#F5F5F7]">
                  {habits.filter(h => h.status === 'active').length}
                </div>
                <div className="text-xs text-[#9CA3AF] uppercase tracking-wide">Active</div>
              </div>
              <div className="bg-[#151519] border border-[#24242B] rounded-2xl p-4 text-center hover:border-[#06B6D4]/50 transition-all">
                <Zap className="w-6 h-6 text-[#06B6D4] mx-auto mb-2" />
                <div className="text-xl font-bold text-[#F5F5F7]">
                  {Math.max(...habits.map(h => h.streak || 0), 0)}
                </div>
                <div className="text-xs text-[#9CA3AF] uppercase tracking-wide">Best</div>
              </div>
            </div>

            {/* Habits list */}
            {loading ? (
              <div className="text-center text-[#9CA3AF] py-8">Loading habits...</div>
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
      <div className="fixed bottom-0 left-0 right-0 bg-[#0E0E11] border-t border-[#24242B] backdrop-blur-xl bg-opacity-95 px-6 py-3 z-20">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setShowAddHabit(true)}
            className="flex flex-col items-center gap-1 -mt-1"
          >
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-xl p-2 shadow-lg shadow-[#8B5CF6]/50 hover:scale-110 transition-all">
              <Plus className="w-7 h-7 text-white" />
            </div>
          </button>
          
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'home' ? 'text-[#8B5CF6] scale-110' : 'text-[#9CA3AF] hover:text-[#F5F5F7]'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'analytics' ? 'text-[#8B5CF6] scale-110' : 'text-[#9CA3AF] hover:text-[#F5F5F7]'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-semibold">Stats</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentTab === 'profile' ? 'text-[#8B5CF6] scale-110' : 'text-[#9CA3AF] hover:text-[#F5F5F7]'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-semibold">Profile</span>
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
