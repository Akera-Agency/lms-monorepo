import React, { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useAuthForm } from '../hooks/useAuth';
import type { Session } from '@supabase/supabase-js';
import { authRoute } from '../utils/external-routes';
import { Loader } from 'lucide-react';

export const GuardContext = createContext<{
  session: Session | null;
  sessionLoading: boolean;
}>({
  session: null,
  sessionLoading: true,
});

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { session, sessionLoading } = useAuthForm();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;

    if (session) {
      setShouldRender(true);
    } else {
      window.location.href = `${authRoute}/login`;
    }
  }, [sessionLoading, session]);

  if (!shouldRender) {
    return (
      <div className="flex items-center text-white text-2xl justify-center gap-3 mt-24">
        <Loader className="h:7 w-7" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <GuardContext.Provider value={{ session, sessionLoading }}>
      {children}
    </GuardContext.Provider>
  );
};
