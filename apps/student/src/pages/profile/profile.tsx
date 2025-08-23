import { useAuthForm } from "../../../../../packages/auth/src/hooks/useAuth";
import { Button } from "@ui/components/button/button";
import { authRoute } from "@/utils/external-route";

export default function Profile() {
  const {
    user,
    signOut,
  } = useAuthForm();
    
  const handleSignOut = async (e:any) => {
    e.preventDefault();
    try{
    await signOut();
    window.location.href = `${authRoute}/login`
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-bold text-white">Profile Page</h1>
        <div className="mt-4 gap-6 text-white">
          <p className="text-center text-xl font-bold mb-6">Welcome!</p>
          <p>Name: {user?.user_metadata.full_name}</p>
          <p>Email: {user?.email}</p>
        </div>

      <Button
        variant="default"
        size={'xl'} 
        className="rounded-full bg-red-800 hover:bg-transparent hover:border"        
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  
  );
}