import { useAuthForm } from '../../../../../packages/auth/src/hooks/use.auth';

export default function Profile() {
  const { user } = useAuthForm();

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-white">USER Page</h1>
      <div className="mt-4 gap-6 text-white">
        <p className="text-center text-xl font-bold mb-6">Welcome!</p>
        <p>Name: {user?.user_metadata.name}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.user_metadata.role}</p>
        <p>Tenant: {user?.user_metadata.tenant}</p>
      </div>
    </div>
  );
}
