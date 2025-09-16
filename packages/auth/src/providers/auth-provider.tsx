import React from 'react';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabase';
import type {
  AuthError,
  AuthResponse,
  OAuthResponse,
  Provider,
  Session,
  User,
} from '@supabase/supabase-js';
import { userRoute } from '../utils/external-routes';
import { ROLES } from '../../../elysia-app/src/shared/constants/permissions';

export const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  sessionLoading: boolean;
  tenants: User[];
  signUp: (email: string, password: string, name:string, role:ROLES, tenant: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithOAuth: (
    provider: Provider,
    redirectPath: string
  ) => Promise<OAuthResponse>;
  resetPassword: (
    email: string,
    redirectPath: string
  ) => Promise<{ data: {}; error: AuthError | null }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ data: { user: User | null }; error: AuthError | null }>;
}>({
  session: null,
  user: null,
  sessionLoading: true,
  tenants: [],
  signUp: async () => ({ data: { user: null, session: null }, error: null }),
  signOut: async () => ({ error: null }),
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signInWithOAuth: async () => ({
    data: { provider: '' as Provider, url: '' },
    error: null,
  }),
  resetPassword: async () => ({ data: {}, error: null }),
  updatePassword: async () => ({ data: { user: null }, error: null }),
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [tenants, setTenants] = useState<User[]>([]);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: ROLES,
    tenant: string
  ): Promise<AuthResponse> => {
    return await supabase.auth.signUp({ 
      email,
      password,
      options:{
        data:{
          name: name,
          role: role,
          tenant: tenant
        }
      } 
    });
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error) setSession(result.data.session);
    return result;
  };

  const signInWithOAuth = async (
    provider: Provider,
    redirectPath: string = '/'
  ): Promise<OAuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${userRoute}${redirectPath}`,
        },
      });

      if (error) {
        console.error('OAuth sign-in error:', error.message);
        throw error;
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error during OAuth sign-in:', err);
      throw err;
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setSessionLoading(false);
    return { error };
  };

  const resetPassword = async (
    email: string,
    redirectPath = '/reset-password'
  ) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${redirectPath}`,
      });
      if (error) {
        console.error('Reset password error:', error.message);
        throw error;
      }
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.error('Update password error:', error.message);
        throw error;
      }
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error during password update:', err);
      throw err;
    }
  };

  useEffect(() => {
    
    const fetchTenants = async () => {
      try {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
        if (error) {
          console.error('Error listing users:', error.message);
          setTenants([]);
          return [];
        }
  
        setTenants(data.users.filter(user => user.user_metadata?.role === 'tenant'));
        return data.users;
      } catch (err) {
        console.error('Unexpected error listing tenants:', err);
        setTenants([]);
        return [];
      }
    };
    fetchTenants();
  }, []);
  
  
  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    const hydrate = async () => {
      setSessionLoading(true);

      try {
        const hash = window.location.hash.slice(1);
        if (hash) {
          const params = new URLSearchParams(hash);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (!error && !cancelled) {
              setSession(data.session);
            }
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        }
      } catch (e) {
        console.error('Error applying session from URL hash:', e);
      }
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!cancelled) {
          setSession(session ?? null);
          setUser(session?.user ?? null);
        }
      } catch (e) {
        if (!cancelled) {
          setSession(null);
          setUser(null);
        }
        console.error('getSession error:', e);
      }

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (cancelled) return;
        setSession(session ?? null);
        setUser(session?.user ?? null);
      });
      unsub = () => data.subscription.unsubscribe();

      if (!cancelled) setSessionLoading(false);
    };

    hydrate();

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const authContextValues = {
    session,
    user,
    sessionLoading,
    tenants,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};
