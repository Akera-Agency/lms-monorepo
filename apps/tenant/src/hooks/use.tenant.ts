import { useEffect, useState } from 'react';
import { TenantApi } from '../api/tenant-api';
import type { User } from '@supabase/supabase-js';
import type { Role } from '../models/roles.model';
import { useAuthForm } from '../../../../packages/auth/src/hooks/use.auth';

export function useTenant() {
  const { session } = useAuthForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'admin', description: 'Administrator with full access', isSystemRole: true },
    { id: '2', name: 'editor', description: 'Can edit content', isSystemRole: false },
    { id: '3', name: 'user', description: 'Regular user with limited access', isSystemRole: false },
  ]);
  const { fetchUsers, inviteUser, deleteUser } = TenantApi;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers(session);
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleInviteUser = async (email: string) => {
    setSuccessMessage(null);
    setError(null);
    try {
      const invitedUser = await inviteUser(email, '/forgot-password');
      if (invitedUser) {
        setUsers((prev) => [...prev, invitedUser]);
        setSuccessMessage(`Invitation sent to ${email}`);
      } else {
        setError('User already exists');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to invite user');
      } else {
        setError('Failed to invite user');
      }
    }
  };

  return {
    handleInviteUser,
    setSuccessMessage,
    setEmail,
    setUsers,
    setRoles,
    setError,
    deleteUser,
    email,
    successMessage,
    users,
    loading,
    error,
    roles,
  };
}
