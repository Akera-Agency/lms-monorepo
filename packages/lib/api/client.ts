import { treaty } from "@elysiajs/eden";
import type { Session } from "@supabase/supabase-js";
import type { App } from "elysia-app";
import type { LanguagesEnum } from "elysia-app/src/shared/constants/i18n";

export const baseApiClient = treaty<App>('http://localhost:4001');

export function apiClient (session: Session | null, language?: LanguagesEnum)  {
    const token = session?.access_token || null;    
    const api = treaty<App>('http://localhost:4001', {

    headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(language ? { 'accept-language': language } : {}),
    },
    
    });
    return api
}

