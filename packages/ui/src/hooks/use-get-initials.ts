import { useMemo } from 'react';

type GetInitialsProps = {
  firstName?: string;
  lastName?: string;
};

export const useGetInitials = ({ firstName, lastName }: GetInitialsProps): string => {
  return useMemo(() => {
    const initials = `${firstName?.charAt(0).toUpperCase() || ''}${
      lastName?.charAt(0).toUpperCase() || ''
    }`;
    return initials;
  }, [firstName, lastName]);
};
