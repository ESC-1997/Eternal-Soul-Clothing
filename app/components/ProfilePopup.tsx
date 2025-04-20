'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
<<<<<<< HEAD
import { createClient, User } from '@supabase/supabase-js';
import { getWelcomeEmailTemplate } from '../utils/emailTemplates';
import { supabase } from '../utils/supabase';
=======
import { getWelcomeEmailTemplate } from '../utils/emailTemplates';
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  shirtSize: string;
}

export default function ProfilePopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeSection, setActiveSection] = useState('name');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shirtSize, setShirtSize] = useState('m');
  const [saveStatus, setSaveStatus] = useState<{[key: string]: string}>({});
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginEmailValid, setIsLoginEmailValid] = useState(false);
  const [isLoginPhoneValid, setIsLoginPhoneValid] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasMinLength: false
  });
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        loadProfileData(session.user.id);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        loadProfileData(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load saved profile data
  const loadProfileData = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setPhoneNumber(data.phoneNumber || '');
      setEmailNotifications(data.emailNotifications || false);
      setSmsNotifications(data.smsNotifications || false);
      setShirtSize(data.shirtSize || 'm');
      
      if (data.email) setIsEmailValid(validateEmail(data.email));
      if (data.phoneNumber) setIsPhoneValid(data.phoneNumber.replace(/\D/g, '').length === 10);
=======

  // Check for existing login state on mount
  useEffect(() => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      setIsLoggedIn(true);
      loadProfileData();
    }
  }, []);

  // Load saved profile data
  const loadProfileData = () => {
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const data = JSON.parse(loginData);
      if (data.profile) {
        setFirstName(data.profile.firstName || '');
        setLastName(data.profile.lastName || '');
        setEmail(data.profile.email || '');
        setPhoneNumber(data.profile.phoneNumber || '');
        setEmailNotifications(data.profile.emailNotifications || false);
        setSmsNotifications(data.profile.smsNotifications || false);
        setShirtSize(data.profile.shirtSize || 'm');
        
        if (data.profile.email) setIsEmailValid(validateEmail(data.profile.email));
        if (data.profile.phoneNumber) setIsPhoneValid(data.profile.phoneNumber.replace(/\D/g, '').length === 10);
      }
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
    }
  };

  // Handle login
<<<<<<< HEAD
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (signInError) throw signInError;

      if (user) {
        const userAccount = await findUserAccount(user.email);
        if (userAccount) {
          setUser(user);
          setShowLoginForm(false);
          setLoginEmail('');
          setPassword('');
        } else {
          throw new Error('User account not found');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
=======
  const handleLogin = () => {
    setShowLoginForm(true);
    setIsSignUp(false);
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
  };

  // Handle signup
  const handleSignup = () => {
    setShowLoginForm(true);
    setIsSignUp(true);
  };

  // Handle logout
<<<<<<< HEAD
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      return;
    }
=======
  const handleLogout = () => {
    localStorage.removeItem('authState');
    localStorage.removeItem('loginData');
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
    setIsLoggedIn(false);
    // Reset all form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
    setEmailNotifications(false);
    setSmsNotifications(false);
    setShirtSize('m');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)})${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)})${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
    const numbers = formattedNumber.replace(/\D/g, '');
    setIsPhoneValid(numbers.length === 10);
  };

  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setLoginEmail(newEmail);
    setIsLoginEmailValid(validateEmail(newEmail));
  };

  const handleLoginPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setLoginPhone(formattedNumber);
    const numbers = formattedNumber.replace(/\D/g, '');
    setIsLoginPhoneValid(numbers.length === 10);
  };

  const validatePassword = (pass: string) => {
    setPasswordCriteria({
      hasUpperCase: /[A-Z]/.test(pass),
      hasLowerCase: /[a-z]/.test(pass),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      hasMinLength: pass.length >= 6
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const isPasswordValid = () => {
    return Object.values(passwordCriteria).every(criterion => criterion);
  };

  // Add these new functions before handleFormSubmit
  const sendIntroductoryEmail = async (email: string) => {
    try {
      // Get the user's first name from their profile data
      const loginData = localStorage.getItem('loginData');
      const firstName = loginData ? JSON.parse(loginData).profile?.firstName : undefined;
      
      // Get the email template with personalized greeting
      const emailHtml = getWelcomeEmailTemplate(firstName);
      
      // TODO: Replace with actual email sending logic
      console.log('Sending introductory email to:', email);
      console.log('Email content:', emailHtml);
      // Example of what this might look like:
      // await sendEmail({
      //   to: email,
      //   subject: 'Your Energy Prevails 🧿',
      //   html: emailHtml
      // });
    } catch (error) {
      console.error('Failed to send introductory email:', error);
    }
  };

  const sendIntroductorySMS = async (phoneNumber: string) => {
    try {
      // TODO: Replace with actual SMS sending logic
      console.log('Sending introductory SMS to:', phoneNumber);
      // Example of what this might look like:
      // await sendSMS({
      //   to: phoneNumber,
      //   message: 'Welcome message content here'
      // });
    } catch (error) {
      console.error('Failed to send introductory SMS:', error);
    }
  };

<<<<<<< HEAD
  const hashPassword = (password: string) => {
    // Simple hash function for demo purposes
    // In a real app, use a proper hashing library like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  const findUserAccount = async (email?: string, phone?: string) => {
    if (!email && !phone) return null;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (error) {
      console.error('Error finding user:', error);
      return null;
    }

    return user;
  };

  const handleFormSubmit = async () => {
    if ((isLoginEmailValid || isLoginPhoneValid) && isPasswordValid()) {
      try {
        if (isSignUp) {
          // Sign up
          const { data, error } = await supabase.auth.signUp({
            email: loginEmail,
            password: password,
            options: {
              data: {
                firstName,
                lastName,
                phone: loginPhone,
                emailNotifications: false,
                smsNotifications: false,
                shirtSize: 'm'
              }
            }
          });

          if (error) throw error;

          // Create profile
          if (data.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  email: loginEmail,
                  phoneNumber: loginPhone,
                  firstName,
                  lastName,
                  emailNotifications: false,
                  smsNotifications: false,
                  shirtSize: 'm'
                }
              ]);

            if (profileError) throw profileError;
          }

          // Send welcome email
          if (isLoginEmailValid) {
            sendIntroductoryEmail(loginEmail);
          }
        } else {
          // Sign in
          await handleLogin({ preventDefault: () => {} } as React.FormEvent);
        }

        setIsLoggedIn(true);
        setShowLoginForm(false);
        setActiveSection('name');
      } catch (error) {
        console.error('Auth error:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
=======
  const handleFormSubmit = () => {
    if ((isLoginEmailValid || isLoginPhoneValid) && isPasswordValid()) {
      // In a real app, this would be an API call
      localStorage.setItem('authState', 'true');
      
      // Get existing login data if it exists
      const existingLoginData = localStorage.getItem('loginData');
      let existingProfile = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        emailNotifications: false,
        smsNotifications: false,
        shirtSize: 'm'
      };

      if (existingLoginData) {
        const parsedData = JSON.parse(existingLoginData);
        if (parsedData.profile) {
          existingProfile = parsedData.profile;
        }
      }

      // For login (not signup), try to find existing profile data by email or phone
      if (!isSignUp && existingLoginData) {
        const allProfiles = JSON.parse(existingLoginData);
        // If logging in with email, look for matching email
        if (isLoginEmailValid && allProfiles.email === loginEmail) {
          existingProfile = allProfiles.profile;
        }
        // If logging in with phone, look for matching phone
        if (isLoginPhoneValid && allProfiles.phone === loginPhone) {
          existingProfile = allProfiles.profile;
        }
      }

      const loginData = {
        email: loginEmail,
        phone: loginPhone,
        password: password, // Note: In a real app, this should be hashed
        profile: {
          ...existingProfile,
          email: isLoginEmailValid ? loginEmail : existingProfile.email,
          phoneNumber: isLoginPhoneValid ? loginPhone : existingProfile.phoneNumber,
          emailNotifications: existingProfile.emailNotifications || false,
          smsNotifications: existingProfile.smsNotifications || false
        }
      };
      
      localStorage.setItem('loginData', JSON.stringify(loginData));
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setActiveSection('name');
      
      // Load the profile data after login
      loadProfileData();

      // Send introductory messages if this is a new signup
      if (isSignUp) {
        if (isLoginEmailValid) {
          sendIntroductoryEmail(loginEmail);
        }
        if (isLoginPhoneValid) {
          sendIntroductorySMS(loginPhone);
        }
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
      }
    }
  };

  // Update the email notifications toggle
  const handleEmailNotificationsToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    if (checked) {
      const loginData = localStorage.getItem('loginData');
      if (loginData) {
        const { email } = JSON.parse(loginData);
        if (email) {
          setEmail(email);
          setIsEmailValid(true);
        }
      }
    }
  };

  // Update the SMS notifications toggle
  const handleSmsNotificationsToggle = (checked: boolean) => {
    setSmsNotifications(checked);
    if (checked) {
      const loginData = localStorage.getItem('loginData');
      if (loginData) {
        const { phone } = JSON.parse(loginData);
        if (phone) {
          setPhoneNumber(phone);
          setIsPhoneValid(true);
        }
      }
    }
  };

<<<<<<< HEAD
  const saveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          firstName,
          lastName,
          email,
          phoneNumber,
          emailNotifications,
          smsNotifications,
          shirtSize
        })
        .eq('id', user.id);

      if (error) throw error;

=======
  const saveProfile = () => {
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const data = JSON.parse(loginData);
      data.profile = {
        firstName,
        lastName,
        email,
        phoneNumber,
        emailNotifications,
        smsNotifications,
        shirtSize
      };
      localStorage.setItem('loginData', JSON.stringify(data));
      
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
      setSaveStatus(prev => ({
        ...prev,
        profile: 'Saved!'
      }));
      
      setTimeout(() => {
        setSaveStatus(prev => ({
          ...prev,
          profile: ''
        }));
      }, 2000);
<<<<<<< HEAD
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
=======
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
    }
  };

  // Update the save buttons to use the new saveProfile function
  const handleSaveName = () => {
    saveProfile();
  };

  const handleSavePreferences = () => {
    saveProfile();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-screen w-full max-w-full sm:max-w-md bg-black/75 shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isLoggedIn ? (
            <div className="flex-1 px-4 sm:px-6 -mt-4">
              {!showLoginForm ? (
                <>
                  <div className="flex flex-col items-center">
                    <Image
                      src="/images/logo.png"
                      alt="Eternal Soul Logo"
                      width={120}
                      height={120}
                      className="mb-4 sm:mb-6 invert"
                    />
                    <div className="text-center mb-4 sm:mb-6">
                      <h2 className="text-2xl sm:text-3xl text-white font-bebas tracking-wider font-bold">ETERNAL SOUL</h2>
                      <h2 className="text-2xl sm:text-3xl text-white font-bebas tracking-wider font-bold">LOGIN</h2>
                    </div>
                    <div className="w-full h-[2px] bg-white/30 mb-4 sm:mb-6"></div>
                    <p className="text-white text-center mb-3 sm:mb-4 text-lg sm:text-xl">
                      <span className="font-bold">Your Soul Called—It Wants Early Access.</span>
                    </p>
                    <p className="text-white text-center text-base sm:text-lg mb-6 sm:mb-8">
                      Sign up or log in to join our exclusive community and be the first to experience Eternal Soul.
                    </p>
                    <div className="flex flex-col items-center space-y-4">
                      <button
                        onClick={handleLogin}
                        className="w-full sm:w-72 px-4 py-2 bg-[#6B21A8] text-white rounded-lg hover:bg-[#581C87] transition-colors font-bold"
                      >
                        Login
                      </button>
                      <button
                        onClick={handleSignup}
                        className="w-full sm:w-72 px-4 py-2 border border-[#6B21A8] bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-bold"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowLoginForm(false)}
                    className="fixed top-16 left-4 z-[100] text-white hover:text-gray-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Playfair_Display'] mb-6 sm:mb-8">
                    {isSignUp ? 'Create Your Account' : 'Login to Your Account'}
                  </h2>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        value={loginEmail}
                        onChange={handleLoginEmailChange}
                        className={`w-full p-3 rounded-lg bg-gray-800 border ${
                          loginEmail ? (isLoginEmailValid ? 'border-green-500' : 'border-red-500') : 'border-gray-700'
                        } text-white placeholder-gray-400 uppercase font-['Inter']`}
                      />
                      <p className="text-center text-gray-400 text-sm uppercase font-['Inter']">or</p>
                      <input
                        type="tel"
                        placeholder="PHONE NUMBER"
                        value={loginPhone}
                        onChange={handleLoginPhoneChange}
                        className={`w-full p-3 rounded-lg bg-gray-800 border ${
                          loginPhone ? (isLoginPhoneValid ? 'border-green-500' : 'border-red-500') : 'border-gray-700'
                        } text-white placeholder-gray-400 uppercase font-['Inter']`}
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={handlePasswordChange}
                        className={`w-full p-3 rounded-lg bg-gray-800 border ${
                          password ? (isPasswordValid() ? 'border-green-500' : 'border-red-500') : 'border-gray-700'
                        } text-white placeholder-gray-400 uppercase font-['Inter']`}
                      />
                      {isSignUp && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p className={`flex items-center ${passwordCriteria.hasUpperCase ? 'text-green-500' : ''}`}>
                            <span className="mr-2">{passwordCriteria.hasUpperCase ? '✓' : '•'}</span>
                            At least 1 uppercase letter
                          </p>
                          <p className={`flex items-center ${passwordCriteria.hasLowerCase ? 'text-green-500' : ''}`}>
                            <span className="mr-2">{passwordCriteria.hasLowerCase ? '✓' : '•'}</span>
                            At least 1 lowercase letter
                          </p>
                          <p className={`flex items-center ${passwordCriteria.hasSpecialChar ? 'text-green-500' : ''}`}>
                            <span className="mr-2">{passwordCriteria.hasSpecialChar ? '✓' : '•'}</span>
                            At least 1 special character
                          </p>
                          <p className={`flex items-center ${passwordCriteria.hasMinLength ? 'text-green-500' : ''}`}>
                            <span className="mr-2">{passwordCriteria.hasMinLength ? '✓' : '•'}</span>
                            Minimum 6 characters
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleFormSubmit}
                      disabled={!((isLoginEmailValid || isLoginPhoneValid) && isPasswordValid())}
                      className={`w-full px-4 py-2 rounded-lg ${
                        (isLoginEmailValid || isLoginPhoneValid) && isPasswordValid()
                          ? 'bg-[#6B21A8] text-white hover:bg-[#581C87]'
                          : 'bg-[#6B21A8] text-white opacity-50 cursor-not-allowed'
                      } transition-colors uppercase font-['Inter']`}
                    >
                      {isSignUp ? 'Create Account' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile</h2>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </div>

                {/* Profile Sections */}
                <div className="space-y-8">
                  {/* Name Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Name</h3>
                      <button
                        onClick={handleSaveName}
                        className="px-4 py-2 bg-[#6B21A8] text-white rounded-lg hover:bg-[#581C87] transition-colors text-sm"
                      >
                        {saveStatus.profile || 'Save'}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                  </section>

                  {/* Preferences Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Preferences</h3>
                      <button
                        onClick={handleSavePreferences}
                        className="px-4 py-2 bg-[#6B21A8] text-white rounded-lg hover:bg-[#581C87] transition-colors text-sm"
                      >
                        {saveStatus.profile || 'Save'}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={emailNotifications}
                            onChange={(e) => handleEmailNotificationsToggle(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B21A8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B21A8]"></div>
                        </label>
                      </div>
                      {emailNotifications && (
                        <div className="pl-4">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full p-3 rounded-lg border text-white placeholder-gray-400 ${
                              isEmailValid ? 'border-green-500 bg-gray-800' : 'border-gray-700 bg-gray-800'
                            }`}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">SMS Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={smsNotifications}
                            onChange={(e) => handleSmsNotificationsToggle(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B21A8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B21A8]"></div>
                        </label>
                      </div>
                      {smsNotifications && (
                        <div className="pl-4">
                          <input
                            type="tel"
                            placeholder="(000)000-0000"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className={`w-full p-3 rounded-lg border text-white placeholder-gray-400 ${
                              isPhoneValid ? 'border-green-500 bg-gray-800' : 'border-gray-700 bg-gray-800'
                            }`}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="text-white">Shirt Size</span>
                        <select 
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                          value={shirtSize}
                          onChange={(e) => setShirtSize(e.target.value)}
                        >
                          <option value="xs">XS</option>
                          <option value="s">S</option>
                          <option value="m">M</option>
                          <option value="l">L</option>
                          <option value="xl">XL</option>
                          <option value="2xl">2XL</option>
                          <option value="3xl">3XL</option>
                        </select>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
} 
=======
} 
>>>>>>> 477b11a9ef7f849fd867a3337d2496961fb5ebdb
