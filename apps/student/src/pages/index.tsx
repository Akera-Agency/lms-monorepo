import { useEffect } from "react";

const Page = () => {

  useEffect(() => {
    window.location.href = "/profile"
  }, []);
  return null
};

export default Page;
