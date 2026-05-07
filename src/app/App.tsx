import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './components/Dashboard';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        setAccessToken(session.access_token);
        setUser(session.user);
        await fetchProfile(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAccessToken(data.session.access_token);
      setUser(data.user);
      await fetchProfile(data.session.access_token);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success('Account created! Please log in.');
    } catch (error) {
      toast.error('Signup failed');
      console.error('Signup error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setUser(null);
    setProfile(null);
    toast.success('Logged out');
  };

  const updateProfile = async (updates: any) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c8bf3146/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        toast.success('Profile updated!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06B6D4] rounded-full blur-[120px] opacity-20" />
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] mb-4 glow-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-[#F5F5F7] text-xl font-bold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <>
        <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />
        <Toaster position="top-center" />
      </>
    );
  }

  if (!profile?.onboardingComplete) {
    return (
      <>
        <OnboardingScreen profile={profile} onComplete={updateProfile} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <Dashboard
        profile={profile}
        accessToken={accessToken}
        onLogout={handleLogout}
        onProfileUpdate={updateProfile}
      />
      <Toaster position="top-center" />
    </>
  );
}
