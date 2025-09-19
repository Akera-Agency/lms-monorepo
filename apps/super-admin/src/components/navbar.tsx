import { useAuthForm } from '../../../../packages/auth/src/hooks/use.auth';
import { authRoute } from '../../../../packages/auth/src/utils/external-routes';
import { Navbar as NavbarComponent } from '../../../../packages/ui/src/components/navbar/navbar';

export function Navbar() {
  const { signOut, setError } = useAuthForm();
  const links = [
    { title: 'Tenants', href: '/tenants' },
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

  return <NavbarComponent handleSignOut={handleSignOut} links={links} />;
}
