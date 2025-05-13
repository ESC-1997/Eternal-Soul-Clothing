"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../supabaseClient';

export default function VerifyPageInner() {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!searchParams) {
        setError('Invalid verification link');
        setVerifying(false);
        return;
      }

      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || type !== 'email') {
        setError('Invalid verification link');
        setVerifying(false);
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          setError(error.message);
        } else {
          // Redirect to profile after successful verification
          router.push('/profile');
        }
      } catch (err) {
        setError('An error occurred during verification');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    setResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError('Please sign in to resend verification email');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) {
        setError(error.message);
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setError('An error occurred while resending verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verifying ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="text-red-600 text-center">{error}</div>
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B1F3B] hover:bg-[#15182c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B1F3B] disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
              {resendSuccess && (
                <p className="text-green-600 text-center">
                  Verification email sent! Please check your inbox.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-green-600">Email verified successfully!</p>
              <p className="mt-2 text-gray-600">Redirecting to your profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 