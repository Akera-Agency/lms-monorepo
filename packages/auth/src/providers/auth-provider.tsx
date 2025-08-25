import { createContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import type { AuthError, AuthResponse, OAuthResponse, Provider, Session, User } from '@supabase/supabase-js';
import { studentRoute } from '../utils/external-routes';

export const AuthContext = createContext<{
    session: Session | null
    user: User | null
    sessionLoading: boolean
    signUp: (email: string, password: string) => Promise<AuthResponse>
    signOut: () => Promise<{ error: AuthError | null }>
    signIn: (email: string, password: string) => Promise<AuthResponse>
    signInWithOAuth: (provider: Provider, redirectPath: string) => Promise<OAuthResponse>
    resetPassword: (email: string, redirectPath: string) => Promise<{data:{}, error: AuthError | null}>
    updatePassword: (newPassword: string) => Promise<{data:{user: User | null}, error: AuthError | null}>
}>({
    session: null,
    user: null,
    sessionLoading: true,
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({error: null}),
    signIn: async () => ({ data: { user: null, session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: "" as Provider, url: "" }, error: null }),
    resetPassword: async () => ({data: {}, error: null}),
    updatePassword: async () => ({ data: { user: null }, error: null })
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);


    const signUp = async (email: string, password: string): Promise<AuthResponse> => {
        return await supabase.auth.signUp({ email, password });
    };

    const signIn = async (email: string, password: string): Promise<AuthResponse> => {
        setSessionLoading(true);
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (!result.error) setSession(result.data.session);
        
        setSessionLoading(false);
        return result;
    };

    const signInWithOAuth = async (provider: Provider, redirectPath: string = "/profile" ): Promise<OAuthResponse> => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                redirectTo: `${studentRoute}${redirectPath}`,
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

    const signOut = async (): Promise<{ error: AuthError | null }> => {
        const { error } = await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setSessionLoading(false);
        return { error };
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

    // useEffect(() => {
    //     const initAuth = async () => {
    //         supabase.auth.getSession().then(({ data: { session } }) => {
    //             setSession(session);
    //         });
    //     }
    //     initAuth();

    //     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    //         setSession(session ??  null);
    //         setSessionLoading(false);
    //     });

    //     return () => {
    //         listener.subscription.unsubscribe();
    //     };
    // }, []);

    useEffect(() => {
        const restoreSessionFromUrl = async () => {
            setSessionLoading(true); 
            const hash = window.location.hash.slice(1);
            if (hash) {
                const params = new URLSearchParams(hash);
                const access_token = params.get("access_token");
                const refresh_token = params.get("refresh_token");
    
                if (access_token && refresh_token) {
                    try {
                        const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
                        if (!error) setSession(data.session);
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } catch (err) {
                        console.error(err);
                        setSession(null);
                    }
                }
            }
    
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
    
            setSessionLoading(false);
        };
    
        restoreSessionFromUrl();
    
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? null);
            setSessionLoading(false);
        });
    
        return () => listener.subscription.unsubscribe();
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
        <AuthContext.Provider value={{ session, user, sessionLoading, signUp, signIn, signOut, signInWithOAuth, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};  
