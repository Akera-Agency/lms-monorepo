import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create projects table
  await db.schema
    .createTable('projects')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('owner_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('status', 'varchar', (col) => col.notNull().defaultTo('active'))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Create tasks table
  await db.schema
    .createTable('tasks')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.references('projects.id').onDelete('cascade').notNull()
    )
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('assignee_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null')
    )
    .addColumn('priority', 'varchar', (col) =>
      col.notNull().defaultTo('medium')
    )
    .addColumn('status', 'varchar', (col) => col.notNull().defaultTo('todo'))
    .addColumn('due_date', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Create comments table
  await db.schema
    .createTable('comments')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('task_id', 'uuid', (col) =>
      col.references('tasks.id').onDelete('cascade').notNull()
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('comments').execute();
  await db.schema.dropTable('tasks').execute();
  await db.schema.dropTable('projects').execute();
}
