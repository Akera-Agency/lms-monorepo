import { useTenant } from '@/hooks/use.tenant';
import { Button } from '@ui/components/button/button';
import Input from '../../../../../packages/ui/src/components/form/input';
import { useToast } from '../../../../../packages/ui/src/hooks/use-toast';
import { useEffect } from 'react';
import Table from '@/components/users-table';

export default function Users() {
  const { successMessage, error, email, setEmail, handleInviteUser } = useTenant();

  const { toast } = useToast();
  useEffect(() => {
    if (successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'success',
        className: 'bg-[#ECFDF5] text-white py-4 border text-[#065F46] border border-[#10B981]',
      });
    } else if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
        className: 'bg-[#FEE2E2] text-white py-4 border text-[#B91C1C] border border-[#EF4444]',
      });
    }
  }, [successMessage, error, toast]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full">
        <Table />
      </div>
      <div className="flex flex-row justify-between items-end w-full gap-4 px-10">
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          label="Email"
          labelClassName="text-white"
          className="max-w-sm lg:text-sm text-xs border-neutral-700 bg-neutral-900 text-white"
          onChange={(e) => {
            const { value } = e.target as HTMLInputElement;
            setEmail(value);
          }}
        />
        <Button
          variant="default"
          className="text-md rounded-md bg-[#F3562E] hover:bg-transparent border hover:border border-[#F3562E] hover:text-[#F3562E]"
          onClick={() => handleInviteUser(email)}
        >
          Invite user
        </Button>
      </div>
    </div>
  );
}
