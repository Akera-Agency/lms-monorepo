import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Enable UUID extension
  await db.executeQuery(
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.compile(db)
  );

  // 1. Create roles table first (users will reference it)
  await db.schema
    .withSchema('public')
    .createTable('roles')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('permissions', 'jsonb', (col) => col.notNull())
    .addColumn('is_system_role', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // 2. Create users table with all fields
  await db.schema
    .withSchema('public')
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().references('auth.users.id').onDelete('cascade')
    )
    .addColumn('email', 'text')
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('role_id', 'uuid', (col) =>
      col.references('roles.id').onDelete('set null')
    )
    .addColumn('avatar_url', 'text')
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('last_login_at', 'timestamptz')
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .withSchema('public')
    .alterTable('users')
    .addUniqueConstraint('users_email_unique', ['email'], (col) =>
      col.nullsNotDistinct()
    )
    .execute();

  // 3. Create tenants table for multitenancy
  await db.schema
    .withSchema('public')
    .createTable('tenants')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'text')
    .addColumn('description', 'text')
    .addColumn('logo_url', 'text')
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Add unique constraint for slug (excluding soft-deleted records)
  await db.schema
    .withSchema('public')
    .alterTable('tenants')
    .addUniqueConstraint('tenants_name_unique', ['name'], (col) =>
      col.nullsNotDistinct()
    )
    .execute();

  // 4. Create tenant_roles table for tenant-specific roles
  await db.schema
    .withSchema('public')
    .createTable('tenant_roles')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('tenant_id', 'uuid', (col) =>
      col.references('tenants.id').onDelete('cascade').notNull()
    )
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('permissions', 'jsonb', (col) => col.notNull())
    .addColumn('is_default', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_system_role', 'boolean', (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // 5. Create tenant_users junction table
  await db.schema
    .withSchema('public')
    .createTable('tenant_users')
    .addColumn('tenant_id', 'uuid', (col) =>
      col.references('tenants.id').onDelete('cascade').notNull()
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('tenant_role_id', 'uuid', (col) =>
      col.references('tenant_roles.id').onDelete('set null')
    )
    .addColumn('joined_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('deleted_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .alterTable('tenant_users')
    .addPrimaryKeyConstraint('tenant_users_pkey', ['tenant_id', 'user_id'])
    .execute();

  // 6. Create Supabase auth triggers
  // Create the function that will be triggered
  await sql`
    CREATE OR REPLACE FUNCTION public.insert_profile()
    RETURNS trigger AS $$
    BEGIN      
      INSERT INTO public.users (id, email, name, is_active, role_id)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        true,
        (SELECT id FROM public.roles WHERE name = NEW.raw_user_meta_data->>'role' LIMIT 1)
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql security definer;
  `.execute(db);

  // Create the trigger on auth.users table
  await sql`
    CREATE TRIGGER users_insert_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.insert_profile();
  `.execute(db);

  // Create a function to handle user updates
  await sql`
    CREATE OR REPLACE FUNCTION public.update_profile()
    RETURNS trigger AS $$
    BEGIN
      UPDATE public.users 
      SET 
        email = NEW.email,
        name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        updated_at = NOW()
      WHERE id = NEW.id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql security definer;
  `.execute(db);

  // Create the update trigger
  await sql`
    CREATE TRIGGER users_update_trigger
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profile();
  `.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Drop the triggers first
  await sql`
    DROP TRIGGER IF EXISTS users_update_trigger ON auth.users;
  `.execute(db);

  await sql`
    DROP TRIGGER IF EXISTS users_insert_trigger ON auth.users;
  `.execute(db);

  // Drop the functions
  await sql`
    DROP FUNCTION IF EXISTS public.update_profile();
  `.execute(db);

  await sql`
    DROP FUNCTION IF EXISTS public.insert_profile();
  `.execute(db);

  // Drop tables in reverse order (respecting foreign key constraints)
  await db.schema.dropTable('tenant_users').execute();
  await db.schema.dropTable('tenant_roles').execute();
  await db.schema.dropTable('tenants').execute();
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('roles').execute();

  // Drop the UUID extension
  await db.executeQuery(sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.compile(db));
}
