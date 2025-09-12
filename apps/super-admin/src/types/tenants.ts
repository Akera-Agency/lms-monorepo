export interface TenantEntity {
    name: string;
    description: string | null;
    id: string;
    logo_url: string | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
}