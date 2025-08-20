import { AuthForm } from "@/components/auth-form"
import { useAuthForm } from "@/hooks/useAuth";

export default function LoginPage() {
    const {
      email,
      password,
      setEmail,
      setPassword,
      loading,
      setLoading,
      error,
      setError,
      signIn,
      session,
      navigate 
    } = useAuthForm();

    console.log(password, email, session);

    const handleSignIn = async (e:any) =>{
      e.preventDefault();
      setLoading(true);
      try{
        const result = await signIn(email, password)
        if (result?.data.session) {
          console.log("Login successful:", result.data);
          navigate({ to: "/profile" });
        }
      else {
          console.error("Login failed:", result.error);
          setError(result?.error?.message || "Login failed");
        }
      }
      catch (error) {
        console.error("Error Signing in up:", error);
        setError(error as string);
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
            title="Login to your account"
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
              id === "email" ? setEmail(value) : setPassword(value);
            }}
            error={error}
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
  )
}
