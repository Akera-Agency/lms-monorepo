import { useAuthForm } from '../../../../../packages/auth/src/hooks/use.auth';
import { AuthForm } from '@/components/auth-form';
import { userRoute } from '../../../../../packages/auth/src/utils/external-routes';
import { tenantRoute } from '../../../../../packages/auth/src/utils/external-routes';

export default function SignupPage() {
  const {
    email,
    password,
    name,
    setName,
    setEmail,
    setPassword,
    loading,
    setLoading,
    error,
    setError,
    signUp,
    setSelectedType,
    selectedType,
    tenant,
    setTenant,
    userTypes,
    setSuccessMessage,
    successMessage,
  } = useAuthForm();

  const handleSignUp = async (e: any) => {
    setSuccessMessage(null);
    setError(null);
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUp(email, password, name, selectedType, tenant);
      if (result?.data.session) {
        console.log('Signup successful:', result.data);
        if (result.data.user?.user_metadata.role === 'student') {
          window.location.href = `${userRoute}/#access_token=${result.data.session.access_token}&refresh_token=${result.data.session.refresh_token}`;
        }
        else if (result.data.user?.user_metadata.role === 'admin') {
          window.location.href = `${tenantRoute}/#access_token=${result.data.session.access_token}&refresh_token=${result.data.session.refresh_token}`;
        }      
      }
      else if (result.error === null) {
        console.log('Signup successful, please confirm your email:', result);
        setSuccessMessage('Signup successful! Please check your email to confirm your account before logging in.');
      }
      else {
        console.error('Signup failed:', result.error);
        setError(result?.error?.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
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
              title="Create an account"
              subtitle="Enter your email below to signup"
              forgotPassword={false}
              submitText="Signup"
              loadingText="Signing up..."
              footerQuestion="Already have an account?"
              footerLinkText="Login"
              footerLinkHref="/login"
              isLoading={loading}
              handleAuth={handleSignUp}
              handleInputChange={(e) => {
                const { id, value } = e.target;
                id === 'email'
                  ? setEmail(value)
                  : id === 'password'
                  ? setPassword(value)
                  : setName(value);
              }}
              error={error}
              successMessage={successMessage}
              passwordInput={true}
              emailInput={true}
              nameInput={true}
              toggle={true}
              OAuth={true}
              selectedType={selectedType}
              userTypes={userTypes}
              handleTypeChange={(type) => setSelectedType(type)}
              handleSelect={(value) => setTenant(value)}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-image.avif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
