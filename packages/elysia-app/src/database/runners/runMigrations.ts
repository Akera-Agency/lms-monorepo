import * as path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { config } from 'dotenv';
import { database } from '../datasource';
import { Logger } from 'src/shared/logger/logger';

config();

async function migrateToLatest() {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'src/database/migrations'),
    }),
    allowUnorderedMigrations: true,
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((migrationResult) => {
    if (migrationResult.status === 'Success') {
      Logger.info(
        `migration "${migrationResult.migrationName}" was executed successfully`
      );
    } else if (migrationResult.status === 'Error') {
      Logger.error(
        `failed to execute migration "${migrationResult.migrationName}"`
      );
    }
  });

  if (error) {
    Logger.error('Failed to migrate');
    Logger.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
