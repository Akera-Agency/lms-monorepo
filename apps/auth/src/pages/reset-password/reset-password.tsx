import { AuthForm } from '@/components/auth-form';
import { useAuthForm } from '../../../../../packages/auth/src/hooks/use.auth';
import { useEffect } from 'react';
import { supabase } from '../../../../../packages/auth/src/utils/supabase';

export default function ResetPassword() {
  const {
    navigate,
    successMessage,
    setSuccessMessage,
    password,
    setPassword,
    loading,
    setLoading,
    error,
    setError,
    updatePassword,
  } = useAuthForm();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        console.log('Recovery session detected:', session);
      } else if (!session) {
        navigate({ to: '/forgot-password' });
      }
    });
  }, []);

  const handleResetPassword = async (e: any) => {
    setError(null);
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updatePassword(password);
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (!result?.error) {
        console.log('update successful:', result.data);
        setSuccessMessage('Your password has been updated');
        navigate({ to: '/login' });
      } else {
        console.error('reset failed:', result.error);
        setError(result?.error?.message || 'reset failed');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10 border-r border-neutral-700">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium text-white">
            <div className="text-primary-foreground flex size-6 items-center justify-center">
              <img src="/akera-logo.svg" alt="Image" />
            </div>
            Akera Agency
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs text-white">
            <AuthForm
              title="Reset your password"
              subtitle="Enter your new password below to update it"
              forgotPassword={false}
              submitText="update"
              loadingText="updating..."
              footerQuestion="Back to"
              footerLinkHref="/login"
              footerLinkText="Login"
              isLoading={loading}
              handleAuth={handleResetPassword}
              handleInputChange={(e) => {
                const { value } = e.target;
                setPassword(value);
              }}
              error={error}
              successMessage={successMessage}
              OAuth={false}
              passwordInput={true}
              emailInput={false}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/reset-password-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
