import { useAuthForm } from "../../../../../packages/auth/src/hooks/useAuth";

export default function Profile() {
  const {
    user
  } = useAuthForm();
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-white">Profile Page</h1>
        <div className="mt-4 gap-6 text-white">
          <p className="text-center text-xl font-bold mb-6">Welcome!</p>
          <p>Name: {user?.user_metadata.full_name}</p>
          <p>Email: {user?.email}</p>
        </div>
    </div>
  
  );
}