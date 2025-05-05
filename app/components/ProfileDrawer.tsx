"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { useProfileDrawer } from '../context/ProfileDrawerContext';

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

export default function ProfileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [phone, setPhone] = useState('');
  const [notifySms, setNotifySms] = useState(false);
  const [shirtSize, setShirtSize] = useState('');

  const router = useRouter();
  const { setUser: setUserInContext, setProfile: setProfileInContext } = useProfileDrawer();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setError('Not logged in');
        setLoading(false);
        return;
      }
      setUser(user);
      setUserInContext(user);
      setEmail(user.email || '');
      // Fetch profile
      let { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      // If no profile row, insert one
      if (!profileData) {
        const { data: newProfile } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email || null,
          phonenumber: null,
          firstname: null,
          lastname: null,
          emailnotifications: false,
          smsnotifications: false,
          shirt_size: null,
        }).select().single();
        profileData = newProfile;
      }
      setProfile(profileData);
      setProfileInContext(profileData);
      setFirstName(profileData?.firstname || '');
      setLastName(profileData?.lastname || '');
      setNotifyEmail(profileData?.emailnotifications || false);
      setNotifySms(profileData?.smsnotifications || false);
      setShirtSize(profileData?.shirt_size || '');
      setPhone(profileData?.phonenumber || '');
      setLoading(false);
    });
  }, [open]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    const updateData: any = {
      firstname: firstName || null,
      lastname: lastName || null,
      email: email || null,
      phonenumber: phone || null,
      emailnotifications: !!notifyEmail,
      smsnotifications: !!notifySms,
      shirt_size: shirtSize || null,
    };
    const { error: updateError, data } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    console.log('Update result:', { updateError, data });
    if (updateError) {
      setError('Failed to update profile.');
    } else {
      setError(null);
      setProfileInContext(data);
      onClose();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    onClose();
    router.push('/');
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-[200] transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ boxShadow: open ? '-4px 0 24px rgba(0,0,0,0.12)' : 'none' }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-[#1B1F3B]">Edit Profile</h2>
        <button onClick={onClose} className="text-[#1B1F3B] hover:text-gray-700 text-2xl">&times;</button>
      </div>
      <form className="p-6 space-y-4" onSubmit={handleSave}>
        {loading ? (
          <div className="text-center text-[#1B1F3B]">Loading...</div>
        ) : (
          <>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-semibold text-[#1B1F3B]">First Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 text-[#1B1F3B]"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold text-[#1B1F3B]">Last Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 text-[#1B1F3B]"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-[#1B1F3B]">Email Address</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  className="w-full border rounded p-2 text-[#1B1F3B]"
                  value={email}
                  disabled
                />
                <label className="flex items-center gap-1 text-xs text-[#1B1F3B]">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.checked)}
                  />
                  Email Notifications
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-[#1B1F3B]">Phone Number</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full border rounded p-2 text-[#1B1F3B]"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone Number"
                />
                <label className="flex items-center gap-1 text-xs text-[#1B1F3B]">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={e => setNotifySms(e.target.checked)}
                  />
                  SMS Notifications
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-[#1B1F3B]">Shirt Size</label>
              <select
                className="w-full border rounded p-2 text-[#1B1F3B]"
                value={shirtSize}
                onChange={e => setShirtSize(e.target.value)}
                required
              >
                <option value="">Select size...</option>
                {SHIRT_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#1B1F3B] text-white py-2 rounded hover:bg-[#15182c] transition-colors font-semibold"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </form>
      <div className="p-6 border-t">
        <button
          type="button"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors font-semibold"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
} 