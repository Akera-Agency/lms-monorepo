import { Button } from '@ui/components/button/button';

const Page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button variant="default" size={'lg'} className="rounded-full">
        Click me
      </Button>
    </div>
  );
};

export default Page;
