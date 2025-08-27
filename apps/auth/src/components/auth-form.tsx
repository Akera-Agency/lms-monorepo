import { cn } from '../../../../packages/ui/src/lib/utils';
import { Button } from '../../../../packages/ui/src/components/shadcn/button';
import Input from '../../../../packages/ui/src/components/form/input';
import type React from 'react';
import { useAuthForm } from '../../../../packages/auth/src/hooks/useAuth';
import type { Provider } from '@supabase/supabase-js';
import { useToast } from '../../../../packages/ui/src/hooks/use-toast';
import { useEffect } from 'react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  forgotPassword: boolean;
  submitText: string;
  footerQuestion: string;
  footerLinkHref: string;
  footerLinkText: string;
  error: string | null;
  successMessage?: string | null;
  isLoading: boolean;
  loadingText: string;
  OAuth: boolean;
  passwordInput: boolean;
  emailInput: boolean;
  handleAuth: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange?: (
    e: React.ChangeEvent<HTMLInputElement> & React.FormEvent<HTMLLabelElement>
  ) => void;
}

export function AuthForm({
  className,
  title,
  subtitle,
  forgotPassword,
  submitText,
  footerQuestion,
  footerLinkHref,
  footerLinkText,
  error,
  successMessage,
  isLoading,
  loadingText,
  OAuth,
  passwordInput,
  emailInput,
  handleAuth,
  handleInputChange,
  ...props
}: React.ComponentProps<'form'> & AuthFormProps) {
  const { toast } = useToast();
  useEffect(() => {
    if (successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'success',
        className:
          'bg-[#ECFDF5] text-white py-4 border text-[#065F46] border border-[#10B981]',
      });
    }
  }, [successMessage, toast]);

  const { setLoading, setError, signInWithOAuth, providers } = useAuthForm();

  const handleOAuthSignUp = async (provider: Provider) => {
    setLoading(true);
    try {
      const result = await signInWithOAuth(provider, '/profile');
      if (!result?.data.url) {
        console.error('OAuth sign-in failed:', result.error);
        setError(result?.error?.message || 'OAuth sign-in failed');
      }
    } catch (error) {
      console.error('Error during OAuth sign-in:', error);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAuth}
      className={cn(
        `flex flex-col ${!passwordInput ? 'gap-12' : 'gap-6'}`,
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm text-balance">{subtitle}</p>
      </div>
      <div className="grid gap-5">
        {emailInput && (
          <div className="grid gap-3">
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              label="Email"
              labelClassName="text-white"
              onChange={handleInputChange}
            />
          </div>
        )}
        {passwordInput && (
          <div className="grid gap-3">
            <Input
              id="password"
              type="password"
              label="Password"
              labelClassName="text-white"
              onChange={handleInputChange}
            />
            {forgotPassword && (
              <div className="flex items-center">
                <a
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            )}
          </div>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-neutral-800"
        >
          {isLoading ? `${loadingText}` : `${submitText}`}
        </Button>
        {error && (
          <p className="text-red-500 text-sm text-center -mt-2 -mb-2">
            {error}
          </p>
        )}
      </div>
      {OAuth && (
        <>
          <div className="relative flex items-center justify-center text-sm my-2">
            <div className="flex-grow border-t border-neutral-700" />
            <span className="text-muted-foreground mx-3 bg-transparent">
              Or continue with
            </span>
            <div className="flex-grow border-t border-neutral-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {providers?.map((provider) => (
              <Button
                key={provider.name}
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => handleOAuthSignUp(provider.name)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d={provider.icon} fill="currentColor" />
                </svg>
              </Button>
            ))}
          </div>
        </>
      )}

      <div className="text-center text-sm">
        {footerQuestion}{' '}
        <a href={footerLinkHref} className="underline underline-offset-4">
          {footerLinkText}
        </a>
      </div>
    </form>
  );
}
