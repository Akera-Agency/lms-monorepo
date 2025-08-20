import { createContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../../utils/supabase';
import type { AuthResponse, Session } from '@supabase/supabase-js';

export const AuthContext = createContext<{
    session: Session | null,
    signUp: (email: string, password: string) => Promise<AuthResponse>,
    signOut: () => Promise<void>,
    signIn: (email: string, password: string) => Promise<AuthResponse>
}>({
    session: null,
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => {},
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    const signUp = async (email: string, password: string): Promise<AuthResponse> => {
        return await supabase.auth.signUp({ email, password });
    };

    const signIn = async (email: string, password: string): Promise<AuthResponse> => {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (!result.error) setSession(result.data.session);
            return result;
        };

    const signOut = async () => {
        await supabase.auth.signOut();
            setSession(null);
        };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ??  null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};  
