import { cn } from '../../../../packages/ui/src/lib/utils';
import { Button } from '../../../../packages/ui/src/components/shadcn/button';
import Input from '../../../../packages/ui/src/components/form/input';
import {DropdownMenu} from '../../../../packages/ui/src/components/dropdown/dropdown-menu';
import type React from 'react';
import { useAuthForm } from '../../../../packages/auth/src/hooks/use.auth';
import type { Provider } from '@supabase/supabase-js';
import { useToast } from '../../../../packages/ui/src/hooks/use-toast';
import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
  toggle?:boolean;
  passwordInput: boolean;
  emailInput: boolean;
  nameInput?: boolean;
  selectedType?: string;
  userTypes?: string[];
  handleTypeChange?: (type: string) => void;
  handleAuth: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange?: (
    e: React.ChangeEvent<HTMLInputElement> & React.FormEvent<HTMLLabelElement>
  ) => void;
  handleSelect?: (value: string) => void;
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
  toggle,
  passwordInput,
  emailInput,
  nameInput,
  selectedType,
  userTypes,
  handleTypeChange,
  handleAuth,
  handleInputChange,
  handleSelect,
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

  const { setLoading, setError, signInWithOAuth, providersList, tenants, tenant, setTenant } = useAuthForm();

  const handleOAuthSignUp = async (provider: Provider) => {
    setLoading(true);
    try {
      const result = await signInWithOAuth(provider, '/');
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

      {toggle && (
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <div className="relative inline-grid w-full grid-cols-2 items-center rounded-lg border border-neutral-700 bg-neutral-900 p-1 select-none">
              <span
                className={`absolute inset-1 w-[calc(50%-0.25rem)] rounded-md bg-neutral-800 transition-transform duration-300 ease-out ${
                  selectedType === (userTypes && userTypes[1]) ? 'translate-x-full' : ''
                }`}
              />

              {userTypes?.map((type) => (
                <span
                  key={type}
                  onClick={() => handleTypeChange && handleTypeChange(type)}
                  className={`z-10 py-2 text-center text-sm font-medium cursor-pointer transition-colors duration-200 ${
                    selectedType === type ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4">
        {nameInput && (
          <div className="grid gap-3">
            <Input
              id="name"
              type="text"
              placeholder="Name"
              label="Name"
              labelClassName="text-white"
              onChange={handleInputChange}
            />
          </div>
        )}


{selectedType === 'student' && (
  <div className="grid gap-3">
    <label className="text-white font-semibold">Tenant</label>
    <div className="w-full"> 
      <DropdownMenu
        options={
          tenants.length === 0
            ? [{ label: 'No Tenant', value: '' }]
            : tenants.map((tenant) => ({
                label: tenant.user_metadata.name,
                value: tenant.user_metadata.name,
              }))
        }
        className="w-full bg-neutral-950 text-white border-white" 
        onSelect={(value) => {setTenant(value) ; handleSelect && handleSelect(value)}}
      >
        <div
          className={cn(
            'w-full rounded-md border-white border px-3 py-2 text-white placeholder:text-neutral-500 cursor-pointer',
            'flex items-center justify-between min-h-[40px]' 
          )}
        >
          {tenant || 'Select a type'}
          <ChevronDown className="ml-2 size-4" />
        </div>
      </DropdownMenu>
    </div>
  </div>
)}

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
          {providersList
            .filter((provider) => provider.enabled)
            .map((provider) => (
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
