import { useAuthForm } from "../../../../packages/auth/src/hooks/useAuth";
import { Button } from "@ui/components/button/button";
import { authRoute } from "../../../../packages/auth/src/utils/external-routes";
import NavLinkList from "../../../../packages/ui/src/components/list/nav-link-list"

export function Navbar() {
    const {
      signOut,
      setError
    } = useAuthForm();
      
    const handleSignOut = async (e:any) => {
      e.preventDefault();
      try{
        const result = await signOut();
        if (result.error) setError(result.error.message)
        window.location.href = `${authRoute}/login`
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); 
        } else {
          setError("Something went wrong. Please try again.");
        }
        console.error("Error signing out:", error);
      }
    }

  return (
    <div  className="flex justify-center">
      <nav className="hidden xl:flex w-[600px] py-4 px-6 text-white text-md font-medium items-center justify-between fixed top-7 bg-neutral-950/40 backdrop-blur-lg rounded-xl border border-neutral-700">
        <img
          src="/navbar-logo.svg"
          alt="Image"
        />
        
          <NavLinkList links={[
            {title:"Our work",href:"/"},
            {title:"Process",href:"/"},
            {title:"Careers",href:"/"},
            {title:"Newsletter",href:"/"}
            ]}/>
      
      <Button
        variant="default"
        className="text-md rounded-md bg-[#F3562E] hover:bg-transparent border hover:border border-[#F3562E] hover:border-[#F3562E]"        
        onClick={handleSignOut}
      >
        Sign out
      </Button>
    </nav>
    </div>
  );
}
