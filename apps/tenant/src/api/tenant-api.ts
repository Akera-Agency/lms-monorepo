<<<<<<< HEAD
import { supabaseAdmin } from "../../../../packages/auth/src/utils/supabase";
import { authRoute } from "../../../../packages/auth/src/utils/external-routes";
import type { User, Session } from "@supabase/supabase-js";
import { apiClient } from "../../../../packages/lib/api/client";
import { edenQueryClient } from "../../../../packages/lib/api/client";
=======
import { supabaseAdmin } from '../../../../packages/auth/src/utils/supabase';
import { authRoute } from '../../../../packages/auth/src/utils/external-routes';
import type { User, Session } from '@supabase/supabase-js';
import { treaty } from '@elysiajs/eden';
import type { App } from '../../../../packages/elysia-app/src/app';
>>>>>>> 9c4a25ecbac0eb8dacd63e02edd2f61034b71d8d

const cooldownMap = new Map<string, number>();

export const TenantApi = {

  async inviteUser(
    email: string,
    redirectPath: string = '/forgot-password',
  ): Promise<User | null> {
    const now = Date.now();
    const last = cooldownMap.get(email);

    if (last && now - last < 60_000) {
      throw new Error(
        `Please wait ${Math.ceil((60_000 - (now - last)) / 1000)} seconds before requesting again.`,
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: `${authRoute}${redirectPath}`,
        data: { role: 'user' },
      },
    );

    if (error) {
      console.error('Error inviting user:', error.message);
      return null;
    }

    cooldownMap.set(email, now);
    console.log('User invited successfully:', data.user);
    return data.user;
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  },

<<<<<<< HEAD
  async fetchUsers(session: Session | null, page: number = 1, limit: number = 10) {
    // const { data, error } = await edenQueryClient().api.users.get({
    //   query: { page, limit }
    // });
    
    const { data, error } = await apiClient(session).api.users.get({
      query: { page, limit }
=======
  async fetchUsers(
    session: Session | null,
    page: number = 1,
    limit: number = 10,
  ) {
    const token = session?.access_token || null;
    const apitest = treaty<App>('http://localhost:4001', {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const { data, error } = await apitest.api.users.get({
      query: { page, limit },
>>>>>>> 9c4a25ecbac0eb8dacd63e02edd2f61034b71d8d
    });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
<<<<<<< HEAD
    console.log(data)
    return data.data; 
  },

}
=======
    console.log(data);
    return data.data;
  },
};
>>>>>>> 9c4a25ecbac0eb8dacd63e02edd2f61034b71d8d
