"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

// Generate a unique ID
const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to check if user is new (created within last 5 minutes)
const isNewUser = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created < 5 * 60 * 1000;
};

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "profile">("email");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifySms, setNotifySms] = useState(false);
  const [shirtSize, setShirtSize] = useState("");
  const [saving, setSaving] = useState(false);
  const [welcomeSent, setWelcomeSent] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      if (user) setStep("profile");
    };
    getSession();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error, count } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("id", user.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        // No profile exists, create one
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, email: user.email })
          .select()
          .single();
        if (insertError) {
          setError("Error creating profile: " + insertError.message);
          setLoading(false);
          return;
        }
        setProfile(newProfile);
        setFirstName(newProfile.firstname || "");
        setLastName(newProfile.lastname || "");
        setPhone(newProfile.phonenumber || "");
        setNotifyEmail(newProfile.emailnotifications || false);
        setNotifySms(newProfile.smsnotifications || false);
        setShirtSize(newProfile.shirt_size || "");
        setLoading(false);
        return;
      }
      if (data.length > 1) {
        setError("Multiple profiles found for this user. Please contact support.");
        setLoading(false);
        return;
      }
      // Exactly one profile found
      const profileData = data[0];
      setProfile(profileData);
      setFirstName(profileData.firstname || "");
      setLastName(profileData.lastname || "");
      setPhone(profileData.phonenumber || "");
      setNotifyEmail(profileData.emailnotifications || false);
      setNotifySms(profileData.smsnotifications || false);
      setShirtSize(profileData.shirt_size || "");
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSendOtp = async () => {
    setError(null);
    setSending(true);
    setResendSuccess(false);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
    }
    setSending(false);
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setVerifying(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (error) {
      setError(error.message);
    } else if (data && data.user) {
      setUser(data.user);
      setStep("profile");
      // Only send welcome email if user is new
      if (isNewUser(data.user.created_at)) {
        fetch('/api/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email, name: firstName }),
        });
      }
    }
    setVerifying(false);
  };

  const handleResendOtp = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setResendSuccess(true);
    }
    setResending(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setEmail("");
    setOtp("");
    setStep("email");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    const updateData: any = {
      firstname: firstName || null,
      lastname: lastName || null,
      phonenumber: phone || null,
      emailnotifications: !!notifyEmail,
      smsnotifications: !!notifySms,
      shirt_size: shirtSize || null,
    };
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setError(null);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#4a4a4a' }}>Loading...</div>;

  if (step === "email") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#4a4a4a' }}>
        <div className="w-full max-w-2xl p-12 rounded shadow min-h-[400px] flex flex-col h-full" style={{ background: '#DADBE4' }}>
          <div className="flex justify-center mb-4">
            <img src="/images/Phoenix_ES_1B1F3B.png" alt="Phoenix ES" className="h-20" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center text-[#1B1F3B] font-['Bebas_Neue']">ETERNAL SOUL LOGIN</h2>
          <p className="text-center mb-4 font-['Lato'] font-semibold text-[#1B1F3B]">
            Enter your email to receive a 6-digit login code.
          </p>
          {error && <div className="text-red-600 text-center mb-2">{error}</div>}
          <input
            type="email"
            className="w-full border rounded p-2 mb-4 text-[#1B1F3B]"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
          />
          <button
            type="button"
            className="w-full py-2 rounded font-bold text-white bg-[#1B1F3B] mt-2"
            onClick={handleSendOtp}
            disabled={sending || !email}
          >
            {sending ? "Sending..." : "Send Code"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#4a4a4a' }}>
        <div className="w-full max-w-2xl p-12 rounded shadow min-h-[400px] flex flex-col h-full" style={{ background: '#DADBE4' }}>
          <div className="flex justify-center mb-4">
            <img src="/images/Phoenix_ES_1B1F3B.png" alt="Phoenix ES" className="h-20" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center text-[#1B1F3B] font-['Bebas_Neue']">Enter Your Code</h2>
          <p className="text-center mb-4 font-['Lato'] font-semibold text-[#1B1F3B]">
            Enter the 6-digit code sent to <span className="font-bold">{email}</span>.
          </p>
          {error && <div className="text-red-600 text-center mb-2">{error}</div>}
          <input
            type="text"
            className="w-full border rounded p-2 mb-4 text-[#1B1F3B] text-center tracking-widest text-2xl"
            placeholder="------"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
            autoFocus
          />
          <button
            type="button"
            className="w-full py-2 rounded font-bold text-white bg-[#1B1F3B] mt-2"
            onClick={handleVerifyOtp}
            disabled={verifying || otp.length !== 6}
          >
            {verifying ? "Verifying..." : "Verify Code"}
          </button>
          <button
            type="button"
            className="w-full py-2 rounded font-bold text-[#1B1F3B] bg-[#DADBE4] border border-[#1B1F3B] mt-4"
            onClick={handleResendOtp}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
          {resendSuccess && <div className="text-green-600 text-center mt-2">Code resent!</div>}
        </div>
      </div>
    );
  }

  // Profile form (step === "profile")
  return (
    <div className="min-h-screen" style={{ background: '#DADBE4' }}>
      <div className="flex justify-center pt-8">
        <img src="/images/Phoenix_ES_1B1F3B.png" alt="Phoenix ES" className="h-24 mb-4" />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#1B1F3B' }}>Preferences</h2>
      {error && <div className="text-red-400 text-center mb-2">{error}</div>}
      <form className="max-w-6xl mx-auto space-y-6 px-4" onSubmit={handleSave}>
        {/* Service Cards Row (responsive) */}
        <div className="flex flex-col md:flex-row md:gap-x-6 md:justify-center">
          {/* Service Card 1: Name */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-2 md:mb-0 md:w-[320px] md:max-w-sm flex-1 relative min-h-[220px]" style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#9F2FFF' }}>Name</h3>
            <div className="flex gap-2 mt-8">
              <div className="flex-1">
                <label className="block mb-1 font-semibold" style={{ color: '#1B1F3B' }}>First Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-white text-[#1B1F3B] placeholder-gray-400"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold" style={{ color: '#1B1F3B' }}>Last Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-white text-[#1B1F3B] placeholder-gray-400"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>
          {/* Service Card 2: Contact */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-2 md:mb-0 md:w-[320px] md:max-w-sm flex-1 relative min-h-[220px]" style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#9F2FFF' }}>Contact</h3>
            <div className="flex gap-2 mb-4 mt-8">
              <div className="flex-1">
                <label className="block mb-1 font-semibold" style={{ color: '#1B1F3B' }}>Email Address</label>
                <input
                  type="email"
                  className="w-full border rounded p-2 bg-white text-[#1B1F3B] placeholder-gray-400"
                  value={user.email}
                  disabled
                />
                <div className="mt-2">
                  <label className="flex items-center gap-1 text-xs" style={{ color: '#1B1F3B' }}>
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={e => setNotifyEmail(e.target.checked)}
                    />
                    Email Notifications
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold" style={{ color: '#1B1F3B' }}>Phone Number</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-white text-[#1B1F3B] placeholder-gray-400"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone Number"
                />
                <div className="mt-2">
                  <label className="flex items-center gap-1 text-xs" style={{ color: '#1B1F3B' }}>
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={e => setNotifySms(e.target.checked)}
                    />
                    SMS Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Service Card 3: Shirt Size */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-2 md:mb-0 md:w-[320px] md:max-w-sm flex-1 relative min-h-[220px]" style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#9F2FFF' }}>Preferences</h3>
            <div className="mb-4 mt-8">
              <label className="block mb-1 font-semibold" style={{ color: '#1B1F3B' }}>Shirt Size</label>
              <select
                className="w-full border rounded p-2 bg-white text-[#1B1F3B]"
                value={shirtSize}
                onChange={e => setShirtSize(e.target.value)}
                required
              >
                <option value="" className="text-gray-400">Select size...</option>
                {SHIRT_SIZES.map(size => (
                  <option key={size} value={size} className="text-black">{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Save/Sign Out Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#9f2fff] text-white rounded-lg hover:bg-[#8a29e6] transition-colors text-sm"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Sign out
          </button>
        </div>
      </form>
    </div>
  );
} 
