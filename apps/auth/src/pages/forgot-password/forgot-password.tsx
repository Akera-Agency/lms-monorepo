import { AuthForm } from "@/components/auth-form"
import { useAuthForm } from "../../../../../packages/auth/src/hooks/useAuth";

export default function ForgotPassword() {
    const {
      email,
      setSuccessMessage,
      successMessage,
      setEmail,
      loading,
      setLoading,
      error,
      setError,
      resetPassword,
    } = useAuthForm();

    const handleResetPassword = async (e:any) =>{
      setSuccessMessage(null)
      setError(null)
      e.preventDefault();
      setLoading(true);
      try{
        const result = await resetPassword(email, "/reset-password")
        if (!result?.error) {
          console.log("reset successful:", result.data);
          setSuccessMessage("Check your email for the reset password link")
        }
      else {
          console.error("reset failed:", result.error);
          setError(result?.error?.message || "reset failed");
        }
      }
      catch (error) {
        console.error("Error resetting password:", error);
        if (error instanceof Error) {
          setError(error.message);  
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
      finally {
        setLoading(false);
      }
    }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10 border-r border-neutral-700">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium text-white">
            <div className="text-primary-foreground flex size-6 items-center justify-center">
            <img
              src="/akera-logo.svg"
              alt="Image"
            />
            </div>
            Akera Agency
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs text-white">
          <AuthForm
            title="Forgot your password?"
            subtitle="Enter your email below to get a reset link "
            forgotPassword={false}
            submitText="Send"
            loadingText="Sending..."
            footerQuestion="Back to"
            footerLinkHref="/login"
            footerLinkText="Login"
            isLoading={loading}
            handleAuth={handleResetPassword}
            handleInputChange={(e) => {
                const { value } = e.target;
                setEmail(value) ;
            }}
            error={error}
            successMessage={successMessage}
            OAuth={false}
            passwordInput={false}
            emailInput={true}
          />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/forgot-password-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
