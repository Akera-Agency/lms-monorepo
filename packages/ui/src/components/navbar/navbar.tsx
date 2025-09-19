import { Button } from '../button/button';
import NavLinkList from '../../components/list/nav-link-list';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from '@tanstack/react-router';

interface NavbarProps {
  handleSignOut: (e: any) => Promise<void>;
  links: { title: string; href: string }[];
}

export function Navbar({ links, handleSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const openLink = location.pathname;

  return (
    <div className="flex justify-center">
      <nav className="z-20 hidden font- sm:flex w-[600px] py-4 px-6 text-white text-md font-medium items-center justify-between fixed top-7 bg-neutral-950/40 backdrop-blur-lg rounded-xl border border-neutral-700">
        <img src="/navbar-logo.svg" alt="Image" />

        <NavLinkList
          containerStyle="flex flex-row"
          linkStyle="bg-gradient-to-r px-2.5 py-1 hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-neutral-100/20 hover:rounded-md shadow-lg hover:shadow-neutral-100/25 active:scale-95"
          links={links}
          openLink={openLink}
        />
        <Button
          variant="default"
          className="bg-gradient-to-r from-primaryOrange to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-primaryOrange hover:text-primaryOrange shadow-lg hover:shadow-primaryOrange/25 active:scale-95"
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
              linkStyle=" transition-colors"
              containerStyle="gap-6 flex flex-col"
              links={links}
              openLink={openLink}
            />
            <Button
              variant="default"
              className="bg-gradient-to-r from-primaryOrange to-[#e94e26] hover:from-transparent hover:to-transparent border-2 border-transparent hover:border-primaryOrange hover:text-primaryOrange shadow-lg hover:shadow-primaryOrange/25 active:scale-95"
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
