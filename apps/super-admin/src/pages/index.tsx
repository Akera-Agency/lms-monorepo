import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    window.location.href = '/tenants';
  }, []);
  return null;
};

export default Page;
