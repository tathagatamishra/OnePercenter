import { useState } from 'react';
import { CheckCircle2, Circle, Flame, Timer as TimerIcon, TrendingUp, AlertTriangle, X, Play, Pause } from 'lucide-react';

interface HabitsListProps {
  habits: any[];
  onComplete: (habitId: string, duration?: number) => void;
  onDelete: (habitId: string) => void;
  onAuraLoss: (habitName: string) => void;
  onAllOrNothing: (habitId: string, success: boolean) => void;
}

export function HabitsList({ habits, onComplete, onDelete, onAuraLoss, onAllOrNothing }: HabitsListProps) {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [showAllOrNothing, setShowAllOrNothing] = useState<string | null>(null);

  const isCompletedToday = (habit: any) => {
    if (!habit.completions || habit.completions.length === 0) return false;
    const today = new Date().toISOString().split('T')[0];
    return habit.completions.some((c: any) => c.date.startsWith(today));
  };

  const startTimer = (habitId: string) => {
    setActiveTimer(habitId);
    setTimerSeconds(0);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = (habitId: string) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    const duration = timerSeconds;
    setActiveTimer(null);
    setTimerSeconds(0);
    onComplete(habitId, duration);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFrequencyBadge = (frequency: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      daily: { color: 'bg-blue-500', label: 'Daily' },
      weekly: { color: 'bg-green-500', label: 'Weekly' },
      monthly: { color: 'bg-purple-500', label: 'Monthly' },
      custom: { color: 'bg-orange-500', label: 'Custom' },
    };
    return badges[frequency] || badges.daily;
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
          <TrendingUp className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/60 mb-2">No habits yet</p>
        <p className="text-white/40 text-sm">Tap + to add your first habit</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-white mb-3">Today's Habits</h2>
      {habits.map((habit) => {
        const completed = isCompletedToday(habit);
        const badge = getFrequencyBadge(habit.frequency);
        const isTimerActive = activeTimer === habit.id;

        return (
          <div
            key={habit.id}
            className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 transition-all ${
              completed ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => !completed && onComplete(habit.id)}
                disabled={completed}
                className="flex-shrink-0 mt-1"
              >
                {completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Circle className="w-6 h-6 text-white/40 hover:text-white/60" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-white/60 mb-2">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`${badge.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                        {badge.label}
                      </span>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-300">
                          <Flame className="w-3 h-3" />
                          <span className="font-semibold">{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(habit.id)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Timer controls */}
                {!completed && (
                  <div className="mt-3 space-y-2">
                    {isTimerActive ? (
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="text-center mb-2">
                          <div className="text-2xl font-bold text-white tabular-nums">
                            {formatTime(timerSeconds)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={pauseTimer}
                            className="flex-1 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg font-medium flex items-center justify-center gap-1"
                          >
                            <Pause className="w-4 h-4" />
                            Pause
                          </button>
                          <button
                            onClick={() => stopTimer(habit.id)}
                            className="flex-1 py-2 bg-green-500/20 text-green-300 rounded-lg font-medium"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startTimer(habit.id)}
                          className="flex-1 py-2 bg-blue-500/20 text-blue-300 rounded-lg font-medium flex items-center justify-center gap-1 text-sm"
                        >
                          <Play className="w-4 h-4" />
                          On this shit
                        </button>
                        <button
                          onClick={() => onComplete(habit.id, habit.targetAmount ? habit.targetAmount * 2 : 0)}
                          className="flex-1 py-2 bg-purple-500/20 text-purple-300 rounded-lg font-medium text-sm"
                        >
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Double down
                        </button>
                      </div>
                    )}

                    {/* Aura mechanics */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAuraLoss(habit.name)}
                        className="flex-1 py-2 bg-red-500/20 text-red-300 rounded-lg font-medium text-sm"
                      >
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Aura loss
                      </button>
                      <button
                        onClick={() => setShowAllOrNothing(habit.id)}
                        className="flex-1 py-2 bg-orange-500/20 text-orange-300 rounded-lg font-medium text-sm"
                      >
                        All or nothing
                      </button>
                    </div>

                    {/* All or Nothing modal */}
                    {showAllOrNothing === habit.id && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 max-w-sm w-full">
                          <h3 className="text-xl font-bold text-white mb-3">All or Nothing</h3>
                          <p className="text-white/80 mb-6 text-sm">
                            Do 2x the work to recover aura. Success: +20 Aura. Failure: -20 Aura.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                onAllOrNothing(habit.id, false);
                                setShowAllOrNothing(null);
                              }}
                              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold"
                            >
                              Failed
                            </button>
                            <button
                              onClick={() => {
                                onAllOrNothing(habit.id, true);
                                setShowAllOrNothing(null);
                              }}
                              className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold"
                            >
                              Completed!
                            </button>
                          </div>
                          <button
                            onClick={() => setShowAllOrNothing(null)}
                            className="w-full mt-3 py-2 text-white/60 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
