import { useState, useEffect } from 'react';

type PasswordStrength = 'weak' | 'medium' | 'strong';

export function usePasswordStrength(password: string): PasswordStrength {
  const [strength, setStrength] = useState<PasswordStrength>('weak');

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      if (password.length > 8) score++;
      if (password.length > 12) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      if (score < 3) return 'weak';
      if (score < 5) return 'medium';
      return 'strong';
    };

    setStrength(calculateStrength());
  }, [password]);

  return strength;
}
