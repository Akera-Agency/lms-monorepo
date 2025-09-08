import { treaty } from "@elysiajs/eden";
import type { Session } from "@supabase/supabase-js";
import type { App } from "elysia-app";
import { treaty as edenQuery } from '@ap0nia/eden-tanstack-query'

export const baseApiClient = treaty<App>('http://localhost:4001');

export function edenQueryClient ()  {
    // const token = session?.access_token || null;    
    const api = edenQuery<App>('http://localhost:4001', {

    // headers: {
    //     'Content-Type': 'application/json',
    //     ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    // },
    
    });
    return api
}

export function apiClient (session: Session | null)  {
    const token = session?.access_token || null;    
    const api = treaty<App>('http://localhost:4001', {

    headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    
    });
    return api
}

