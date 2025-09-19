import type { LanguagesEnum } from "elysia-app/src/shared/constants/i18n";

export interface UsersTenants{
    user: {
        id: string;
        name: string;
        deleted_at: Date | null;
        created_at: Date;
        updated_at: Date;
        email: string;
        role_id: string | null;
        avatar_url: string | null;
        language: LanguagesEnum;
        is_active: boolean;
        last_login_at: Date | null;
    };
    tenants: {
        id: string;
        name: string;
        description: string | null;
        logo_url: string | null;
        is_public: boolean;
        deleted_at: Date | null;
        created_at: Date;
        updated_at: Date;
    }[];
}