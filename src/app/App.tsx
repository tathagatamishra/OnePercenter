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
      await handleLogin(email, password);
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
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl font-bold">Loading...</div>
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
