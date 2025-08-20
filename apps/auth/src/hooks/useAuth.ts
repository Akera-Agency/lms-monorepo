import { useContext, useState } from "react";
import { AuthContext } from "@/app/providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";

const useAuth = () => useContext(AuthContext);

export const useAuthForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signOut, signUp, signIn ,session} = useAuth();
    const navigate = useNavigate();
    return { 
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
        session,
        navigate
    };
};  