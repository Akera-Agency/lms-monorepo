import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // Create activities table
  await db.schema
    .withSchema('public')
    .createTable('activities')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('earned_xp', 'integer', (col) => col.notNull())
    .addColumn('earned_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('deleted_at', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // Drop the table
  await db.schema.dropTable('activities').execute();
}
