import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    window.location.href = '/users';
  }, []);
  return null;
};

export default Page;
