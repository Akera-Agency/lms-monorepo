import {Button} from "@ui/components/button/button"

const Page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
    <Button
      variant="default"
      size={'xl'} 
      className="rounded-full bg-neutral-800 hover:bg-transparent hover:border"
      onClick={() => window.location.href = '/login'}>
      Go to Login
    </Button>
  </div>
  );
};

export default Page;
