import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>) {
  await db.executeQuery(
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.compile(db)
  );

  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable('todos')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('completed', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable('todos').execute();
  await db.schema.dropTable('users').execute();
  await db.executeQuery(sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.compile(db));
}
