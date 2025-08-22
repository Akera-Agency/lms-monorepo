import { createContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../../../../apps/auth/src/utils/supabase';
import type { AuthError, AuthResponse, OAuthResponse, Provider, Session, User } from '@supabase/supabase-js';

export const AuthContext = createContext<{
    session: Session | null
    user: User | null
    signUp: (email: string, password: string) => Promise<AuthResponse>
    signOut: () => Promise<void>
    signIn: (email: string, password: string) => Promise<AuthResponse>
    signInWithOAuth: (provider: Provider, redirectPath: string) => Promise<OAuthResponse>
    resetPassword: (email: string, redirectPath: string) => Promise<{data:{}, error: AuthError | null}>
    updatePassword: (newPassword: string) => Promise<{data:{user: User | null}, error: AuthError | null}>
}>({
    session: null,
    user: null,
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => {},
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: "" as Provider, url: "" }, error: null }),
    resetPassword: async () => ({data: {}, error: null}),
    updatePassword: async () => ({ data: { user: null }, error: null })
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const signUp = async (email: string, password: string): Promise<AuthResponse> => {
        return await supabase.auth.signUp({ email, password });
    };

    const signIn = async (email: string, password: string): Promise<AuthResponse> => {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (!result.error) setSession(result.data.session);
            return result;
        };

        const signInWithOAuth = async (provider: Provider, redirectPath: string = "/profile" ): Promise<OAuthResponse> => {
            try {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider,
                    options: {
                    redirectTo: `${import.meta.env.VITE_STUDENT_APP}${redirectPath}`,
                    },
                });

                if (error) {
                    console.error("OAuth sign-in error:", error.message);
                    throw error;
                }

                return { data, error: null };
            } catch (err) {
                console.error("Unexpected error during OAuth sign-in:", err);
                throw err;
            }
        };

    const signOut = async () => {
        await supabase.auth.signOut();
            setSession(null);
        };

    const resetPassword = async (email: string, redirectPath= "/reset-password") => {
        try{
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${redirectPath}`,
        })
        if (error){
            console.error("Reset password error:", error.message);
            throw error;
        }
        return { data, error: null };
        } catch (err) {
            console.error("Unexpected error during password reset:", err);
            throw err;
        }
    }

    const updatePassword = async (newPassword: string) => {
        try{
        const { data, error } = await supabase.auth.updateUser({password: newPassword})
        if (error){
            console.error("Update password error:", error.message);
            throw error;
        }
        return { data, error: null };
        } catch (err) {
            console.error("Unexpected error during password update:", err);
            throw err;
        }
    }

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

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            } else {
                console.log("No user found");
            }
        }).catch(error => {
            console.error("Error fetching user:", error);
        })
    }, []);

    return (
        <AuthContext.Provider value={{ session, signUp, signIn, signOut, user, signInWithOAuth, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};  
