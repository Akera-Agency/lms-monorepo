export interface TeanantRoleEntity {
    id: string;
    name: string;
    description: string | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
    permissions: Record<string, string[]>;
    tenant_id: string;
    is_default: boolean;
    is_system_role: boolean;
}