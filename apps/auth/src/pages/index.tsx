import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    window.location.href = '/login';
  }, []);
  return null;
};

export default Page;
