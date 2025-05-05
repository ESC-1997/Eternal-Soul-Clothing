import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    shirtSize: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [error, setError] = useState(null);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Create profile row
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: formData.fullName,
            preferred_shirt_size: formData.shirtSize,
            phone_number: formData.phoneNumber,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            country: formData.country,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      // Send welcome email
      try {
        const emailResponse = await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data.user.email,
            name: formData.fullName,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Welcome email error:', errorData);
          // Don't throw here - we don't want to block signup if email fails
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw here - we don't want to block signup if email fails
      }

      // Open profile drawer
      setProfileDrawerOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default SignUpForm; 