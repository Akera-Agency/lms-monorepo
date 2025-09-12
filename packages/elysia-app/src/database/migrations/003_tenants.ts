import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add is_public column to tenants table
  await db.schema
    .alterTable('tenants')
    .addColumn('is_public', 'boolean', (col) =>
      col.notNull().defaultTo(true)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
      .alterTable('tenants')
      .dropColumn('is_public')
      .execute();
  }
  
