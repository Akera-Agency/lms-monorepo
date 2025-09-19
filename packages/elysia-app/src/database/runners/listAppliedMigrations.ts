import * as path from 'path';
import { promises as fs } from 'fs';
import { Migrator, FileMigrationProvider } from 'kysely';
import { database } from '../datasource';
import { Logger } from 'src/shared/logger/logger';

async function listAppliedMigrations() {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'src/database/migrations'),
    }),
  });

  const results = await migrator.getMigrations();

  return results.map((migration) => migration.name); // Extracting only the names of the migrations
}

async function displayAppliedMigrations() {
  try {
    const appliedMigrations = await listAppliedMigrations();
    Logger.info('Applied migrations:');
    appliedMigrations.forEach((migrationName) => Logger.info('- ' + migrationName));
  } catch (error) {
    Logger.error('An error occurred: ' + error);
  } finally {
    await database.destroy();
  }
}

displayAppliedMigrations();
