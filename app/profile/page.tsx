'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../supabaseClient';
import { useProfileDrawer } from '../context/ProfileDrawerContext';

export default function ProfilePage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, setDrawerOpen } = useProfileDrawer();

  // Handle sign in
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      setDrawerOpen(true);
    }
    setLoading(false);
  };

  // Handle sign up
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email: emailOrPhone,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Create profile row
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id });
      setUser(data.user);
      setDrawerOpen(true);
    }
    setLoading(false);
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, [setUser]);

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff]">
        <div className="flex flex-col items-center w-full max-w-md">
          <Image
            src="/images/Phoenix_ES_1B1F3B.png"
            alt="Phoenix Eternal Soul"
            width={180}
            height={60}
            className="mb-2 object-contain"
          />
          <h1
            className="text-3xl mb-2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              color: '#1B1F3B'
            }}
          >
            Eternal Soul Login
          </h1>
        </div>
        <p className="mb-6 text-gray-600 max-w-2xl text-center mx-auto">
          Welcome, {user.email || user.phone}! You are logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff]">
      <div className="flex flex-col items-center w-full max-w-md">
        <Image
          src="/images/Phoenix_ES_1B1F3B.png"
          alt="Phoenix Eternal Soul"
          width={180}
          height={60}
          className="mb-2 object-contain"
        />
        <h1
          className="text-3xl mb-2"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            color: '#1B1F3B'
          }}
        >
          Eternal Soul Login
        </h1>
      </div>
      <p className="mb-6 text-gray-600 max-w-2xl text-center mx-auto">
        Step into your realm. Unlock early access to exclusive drops, and stay in the loop with cosmic deals made just for you. This isn't just a profile—it's your portal to everything Eternal.
      </p>
      <form className="space-y-4 w-full max-w-md" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block mb-1 font-semibold text-[#1B1F3B]">Email address or phone number</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-[#1B1F3B]"
            value={emailOrPhone}
            onChange={e => setEmailOrPhone(e.target.value)}
            placeholder="Enter your email or phone number"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-[#1B1F3B]">Password</label>
          <input
            type="password"
            className="w-full border rounded p-2 text-[#1B1F3B]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded font-bold text-white ${mode === 'signin' ? 'bg-[#1B1F3B]' : 'bg-gray-400 hover:bg-[#1B1F3B]'}`}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading && mode === 'signin' ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded font-bold text-white ${mode === 'signup' ? 'bg-[#1B1F3B]' : 'bg-gray-400 hover:bg-[#1B1F3B]'}`}
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading && mode === 'signup' ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
} 
