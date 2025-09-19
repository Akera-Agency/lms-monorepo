import { AuthForm } from '@/components/auth-form';
import { useAuthForm } from '../../../../../packages/auth/src/hooks/use.auth';
import { userRoute } from '../../../../../packages/auth/src/utils/external-routes';
import { tenantRoute } from '../../../../../packages/auth/src/utils/external-routes';
import { superAdminRoute } from '../../../../../packages/auth/src/utils/external-routes';

export default function LoginPage() {
  const { email, password, setEmail, setPassword, loading, setLoading, error, setError, signIn } =
    useAuthForm();

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result?.data.session) {
        console.log('Login successful:', result.data);
        if (result.data.user?.user_metadata.role === 'student') {
          window.location.href = `${userRoute}/#access_token=${result.data.session.access_token}&refresh_token=${result.data.session.refresh_token}`;
        } else if (result.data.user?.user_metadata.role === 'admin') {
          window.location.href = `${tenantRoute}/#access_token=${result.data.session.access_token}&refresh_token=${result.data.session.refresh_token}`;
        } else if (result.data.user?.user_metadata.role === 'super_admin') {
          window.location.href = `${superAdminRoute}/#access_token=${result.data.session.access_token}&refresh_token=${result.data.session.refresh_token}`;
        }
      } else {
        console.error('Login failed:', result.error);
        setError(result?.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
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
              title="Welcome back"
              subtitle="Enter your email below to login to your account"
              forgotPassword={true}
              submitText="Login"
              loadingText="Logging in..."
              footerQuestion="Don't have an account?"
              footerLinkHref="/signup"
              footerLinkText="Sign up"
              isLoading={loading}
              handleAuth={handleSignIn}
              handleInputChange={(e) => {
                const { id, value } = e.target;
                id === 'email' ? setEmail(value) : setPassword(value);
              }}
              error={error}
              OAuth={true}
              passwordInput={true}
              emailInput={true}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/signup-image.avif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
