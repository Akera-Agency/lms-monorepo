import { Kysely } from 'kysely';
import { LanguagesEnum } from 'src/shared/constants/i18n';

export async function up(db: Kysely<any>): Promise<void> {
  // Add language column to users table
  await db.schema
    .alterTable('users')
    .addColumn('language', 'text', (col) =>
      col.notNull().defaultTo(LanguagesEnum.en)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove language column from users table
  await db.schema.alterTable('users').dropColumn('language').execute();
}
