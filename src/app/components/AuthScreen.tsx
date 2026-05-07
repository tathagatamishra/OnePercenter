import { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string) => void;
}

export function AuthScreen({ onLogin, onSignup }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(email, password, name);
    }
  };

  return (
    <div className="size-full min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md mb-4">
              <Sparkles className="w-10 h-10 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">OnePercenter</h1>
            <p className="text-lg text-white/80 font-medium">Improve 1% Every Day</p>
            <p className="text-sm text-white/60 mt-1">Farm aura and mog everyone</p>
          </div>

          {/* Auth form */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  isLogin
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/10 text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  !isLogin
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/10 text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                {isLogin ? 'Start Building Aura' : 'Join the 1%'}
              </button>
            </form>
          </div>

          <p className="text-center text-white/60 text-sm mt-6">
            The 1% rule: Add one new good habit daily
          </p>
        </div>
      </div>
    </div>
  );
}
