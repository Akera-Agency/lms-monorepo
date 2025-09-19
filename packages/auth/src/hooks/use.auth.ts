import { useContext, useState } from 'react';
import { AuthContext } from '../providers/auth-provider';
import { useNavigate } from '@tanstack/react-router';
import { providers } from '../constants/oauth-config';
import type { Provider } from '@supabase/supabase-js';

const useAuth = () => useContext(AuthContext);

export const useAuthForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const userTypes = ['student', 'admin'];
  const [selectedType, setSelectedType] = useState(userTypes[0]);
  const [tenant, setTenant] = useState<string>('');

  const [providersList, setProvidersList] = useState(
    providers.map((p) => ({
      ...p,
      enabled: p.defaultEnabled,
    })),
  );

  const toggleProvider = (ProviderName: Provider) => {
    setProvidersList((prev) =>
      prev.map((p) => (p.name === ProviderName ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const {
    sessionLoading,
    session,
    user,
    tenants,
    signOut,
    signUp,
    signIn,
    signInWithOAuth,
    resetPassword,
    updatePassword,
  } = useAuth();

  const navigate = useNavigate();

  return {
    successMessage,
    email,
    password,
    name,
    loading,
    error,
    session,
    user,
    sessionLoading,
    userTypes,
    selectedType,
    tenant,
    tenants,
    providersList,
    toggleProvider,
    setEmail,
    setSuccessMessage,
    setPassword,
    setName,
    setLoading,
    setError,
    signOut,
    signUp,
    signIn,
    signInWithOAuth,
    updatePassword,
    resetPassword,
    navigate,
    setSelectedType,
    setTenant,
  };
};
