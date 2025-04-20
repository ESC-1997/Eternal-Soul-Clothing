'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient, User } from '@supabase/supabase-js';
import { getWelcomeEmailTemplate } from '../utils/emailTemplates';
import { supabase } from '../utils/supabase';

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
    }
  };

  // Handle login
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
  };

  // Handle signup
  const handleSignup = () => {
    setShowLoginForm(true);
    setIsSignUp(true);
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      return;
    }
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
    return Object.values(passwordCriteria).every(criteria => criteria);
  };

  const sendIntroductoryEmail = async (email: string) => {
    try {
      const template = getWelcomeEmailTemplate(firstName);
      // In a real app, this would be an API call to your email service
      console.log('Sending welcome email to:', email);
      console.log('Email content:', template);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const sendIntroductorySMS = async (phoneNumber: string) => {
    try {
      // In a real app, this would be an API call to your SMS service
      console.log('Sending welcome SMS to:', phoneNumber);
    } catch (error) {
      console.error('Error sending welcome SMS:', error);
    }
  };

  const findUserAccount = async (email?: string, phone?: string) => {
    try {
      if (email) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error) throw error;
        return data;
      }
      
      if (phone) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phoneNumber', phone)
          .single();
        
        if (error) throw error;
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding user account:', error);
      return null;
    }
  };

  const handleFormSubmit = async () => {
    if ((isLoginEmailValid || isLoginPhoneValid) && isPasswordValid()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: loginEmail,
          password: password,
        });

        if (error) throw error;

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: loginEmail,
                phoneNumber: loginPhone,
                firstName: firstName,
                lastName: lastName,
                emailNotifications: emailNotifications,
                smsNotifications: smsNotifications,
                shirtSize: shirtSize
              }
            ]);

          if (profileError) throw profileError;

          // Send welcome messages
          if (isLoginEmailValid) {
            sendIntroductoryEmail(loginEmail);
          }
          if (isLoginPhoneValid) {
            sendIntroductorySMS(loginPhone);
          }

          setShowLoginForm(false);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  const handleEmailNotificationsToggle = (checked: boolean) => {
    setEmailNotifications(checked);
  };

  const handleSmsNotificationsToggle = (checked: boolean) => {
    setSmsNotifications(checked);
  };

  const saveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          shirt_size: shirtSize,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
  };

  const handleSaveName = async () => {
    await saveProfile();
    setSaveStatus(prev => ({
      ...prev,
      name: 'Saved!'
    }));
    setTimeout(() => {
      setSaveStatus(prev => ({
        ...prev,
        name: ''
      }));
    }, 2000);
  };

  const handleSavePreferences = async () => {
    await saveProfile();
    setSaveStatus(prev => ({
      ...prev,
      preferences: 'Saved!'
    }));
    setTimeout(() => {
      setSaveStatus(prev => ({
        ...prev,
        preferences: ''
      }));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="space-y-6">
            <div className="text-center">
              <Image
                src="/images/logo.png"
                alt="Eternal Soul Logo"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Welcome to Eternal Soul</h3>
              <p className="text-gray-600 mb-4">Sign in or create an account to continue</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleSignup}
                className="w-full py-2 px-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Account</h3>
                <p className="text-gray-600 text-sm">{email || 'No email set'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Sign Out
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 ${
                    email && !isEmailValid ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500 ${
                    phoneNumber && !isPhoneValid ? 'border-red-500' : ''
                  }`}
                  placeholder="(000) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shirt Size
                </label>
                <select
                  value={shirtSize}
                  onChange={(e) => setShirtSize(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="xs">Extra Small</option>
                  <option value="s">Small</option>
                  <option value="m">Medium</option>
                  <option value="l">Large</option>
                  <option value="xl">Extra Large</option>
                  <option value="2xl">2X Large</option>
                  <option value="3xl">3X Large</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive updates and promotions via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => handleEmailNotificationsToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive updates and promotions via text
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => handleSmsNotificationsToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={saveProfile}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (saveStatus.profile || 'Save Changes')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
