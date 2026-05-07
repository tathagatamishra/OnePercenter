import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar, Flame } from 'lucide-react';

interface AnalyticsViewProps {
  accessToken: string;
  habits: any[];
  profile: any;
}

export function AnalyticsView({ accessToken, habits, profile }: AnalyticsViewProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/analytics`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-8 text-center text-white/60">
        Loading analytics...
      </div>
    );
  }

  const frequencyData = analytics?.habitsByFrequency
    ? [
        { name: 'Daily', value: analytics.habitsByFrequency.daily },
        { name: 'Weekly', value: analytics.habitsByFrequency.weekly },
        { name: 'Monthly', value: analytics.habitsByFrequency.monthly },
        { name: 'Custom', value: analytics.habitsByFrequency.custom },
      ].filter((d) => d.value > 0)
    : [];

  const auraHistory = (profile.auraHistory || []).slice(-7).map((entry: any) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    aura: entry.auraAfter,
    type: entry.type,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b'];

  return (
    <div className="px-6 py-4 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <Activity className="w-6 h-6 text-blue-300 mb-2" />
          <div className="text-2xl font-bold text-white">{analytics?.totalHabits || 0}</div>
          <div className="text-sm text-white/70">Total Habits</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <TrendingUp className="w-6 h-6 text-green-300 mb-2" />
          <div className="text-2xl font-bold text-white">{analytics?.activeHabits || 0}</div>
          <div className="text-sm text-white/70">Active Habits</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <Calendar className="w-6 h-6 text-purple-300 mb-2" />
          <div className="text-2xl font-bold text-white">{analytics?.totalCompletions || 0}</div>
          <div className="text-sm text-white/70">Completions</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <Flame className="w-6 h-6 text-orange-300 mb-2" />
          <div className="text-2xl font-bold text-white">{analytics?.longestStreak || 0}</div>
          <div className="text-sm text-white/70">Longest Streak</div>
        </div>
      </div>

      {/* Aura history */}
      {auraHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Aura Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={auraHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="aura" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habits by frequency */}
      {frequencyData.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Habits by Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={frequencyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {frequencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habit streaks */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Top Streaks</h3>
        <div className="space-y-2">
          {habits
            .sort((a, b) => (b.streak || 0) - (a.streak || 0))
            .slice(0, 5)
            .map((habit) => (
              <div key={habit.id} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div className="flex-1">
                  <div className="text-white font-medium">{habit.name}</div>
                  <div className="text-xs text-white/60">{habit.frequency}</div>
                </div>
                <div className="flex items-center gap-1 text-orange-300">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold">{habit.streak || 0}</span>
                </div>
              </div>
            ))}
          {habits.length === 0 && (
            <p className="text-white/60 text-sm text-center py-4">No habits yet</p>
          )}
        </div>
      </div>

      {/* Recent aura changes */}
      {profile.auraHistory && profile.auraHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Aura Changes</h3>
          <div className="space-y-2">
            {profile.auraHistory.slice(-5).reverse().map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div className="flex-1">
                  <div className="text-white text-sm">{entry.reason}</div>
                  <div className="text-xs text-white/60">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-bold ${entry.type === 'gain' ? 'text-green-300' : 'text-red-300'}`}>
                  {entry.type === 'gain' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{entry.type === 'gain' ? '+' : '-'}{entry.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
