import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  // notifications
  await db.schema
    .withSchema('public')
    .createTable('notifications')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('public.users.id').onDelete('cascade')
    )
    .addColumn('event', 'text', (col) => col.notNull())
    .addColumn('template', 'text', (col) => col.notNull())
    .addColumn('payload', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`)
    )
    .addColumn('read_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  // index on (user_id, created_at desc)
  await db.executeQuery(
    sql`create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);`.compile(
      db
    )
  );

  // notification_email_log
  await db.schema
    .withSchema('public')
    .createTable('notification_logs')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('public.users.id').onDelete('cascade')
    )
    .addColumn('event', 'text', (col) => col.notNull())
    .addColumn('subject', 'text')
    .addColumn('payload', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`)
    )
    .addColumn('status', 'text', (col) =>
      col.notNull().check(sql`status in ('sent', 'failed')`)
    )
    .addColumn('provider_id', 'text')
    .addColumn('error', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  // notification_preferences
  await db.schema
    .withSchema('public')
    .createTable('notification_preferences')
    .ifNotExists()
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('public.users.id').onDelete('cascade')
    )
    .addColumn('event', 'text', (col) => col.notNull())
    .addColumn('channel', 'text', (col) => col.notNull())
    .addColumn('enabled', 'boolean', (col) => col.notNull().defaultTo(true))
    .addPrimaryKeyConstraint('notification_preferences_pkey', [
      'user_id',
      'event',
      'channel',
    ])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .withSchema('public')
    .dropTable('notification_preferences')
    .ifExists()
    .execute();
  await db.schema
    .withSchema('public')
    .dropTable('notification_logs')
    .ifExists()
    .execute();
  await db.schema
    .withSchema('public')
    .dropTable('notifications')
    .ifExists()
    .execute();
}
