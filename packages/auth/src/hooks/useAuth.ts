import { useContext, useState } from "react";
import { AuthContext } from "../providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import type { Provider } from "@supabase/supabase-js";

const useAuth = () => useContext(AuthContext);

export const useAuthForm = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signOut, signUp, signIn ,session, user, signInWithOAuth, resetPassword, updatePassword, sessionLoading} = useAuth();
    const navigate = useNavigate();
    const providers = [
        {name: 'google' as Provider, 
        icon: 'M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z',
        },
        {name: 'facebook' as Provider, 
        icon: 'M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z',
        },
    ]
    return { 
        successMessage,
        setSuccessMessage,
        email,
        password, 
        setEmail, 
        setPassword, 
        loading, 
        setLoading, 
        error, 
        setError, 
        signOut, 
        signUp, 
        signIn, 
        signInWithOAuth,
        updatePassword,
        resetPassword,
        session,
        user,
        navigate,
        providers,
        sessionLoading,
    };
};  