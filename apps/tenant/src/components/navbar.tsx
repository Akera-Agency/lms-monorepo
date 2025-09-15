import { useAuthForm } from '../../../../packages/auth/src/hooks/use.auth';
import { Button } from '@ui/components/button/button';
import { authRoute } from '../../../../packages/auth/src/utils/external-routes';
import NavLinkList from '../../../../packages/ui/src/components/list/nav-link-list';
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "@tanstack/react-router";

export function Navbar() {
  const { signOut, setError } = useAuthForm();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const openLink = location.pathname;
  const links = [
    { title: 'Users', href: '/users' },
    { title: 'Roles', href: '/roles' },
  ];
  
  const handleSignOut = async (e: any) => {
    e.preventDefault();
    try {
      const result = await signOut();
      if (result.error) setError(result.error.message);
      window.location.href = `${authRoute}/login`;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex justify-center">
      <nav className="z-20 hidden font- sm:flex w-[600px] py-4 px-6 text-white text-md font-medium items-center justify-between fixed top-7 bg-neutral-950/40 backdrop-blur-lg rounded-xl border border-neutral-700">
        <img src="/navbar-logo.svg" alt="Image" />

        <NavLinkList
          containerStyle="flex flex-row"
          linkStyle="hover:bg-neutral-400/20 px-2.5 py-1.5 rounded-lg "
          links={links}
          openLink={openLink}
        />
        <Button
          variant="default"
          className="text-md font-normal rounded-md bg-[#F3562E] hover:bg-transparent border hover:border border-[#F3562E] hover:text-[#F3562E]"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </nav>

      <nav className="sm:hidden fixed top-5 left-1/2 -translate-x-1/2 z-30 w-[90%] bg-neutral-950/60 backdrop-blur-lg border border-neutral-700 rounded-xl px-4 py-3 flex items-center justify-between">
        <img src="/navbar-logo.svg" alt="Logo" className="h-6" />

        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="sm:hidden fixed top-20 left-0 w-full bg-neutral-950/95 backdrop-blur-xl border-y border-neutral-700 p-6 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 text-white text-md font-medium">
          <NavLinkList
          linkStyle=' transition-colors'
          containerStyle="gap-6 flex flex-col"
          links={links}
          openLink={openLink}
        />
            <Button
              variant="default"
              className="w-full font-normal mt-4 text-md rounded-md bg-[#F3562E] hover:bg-transparent border border-[#F3562E] hover:text-[#F3562E]"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
