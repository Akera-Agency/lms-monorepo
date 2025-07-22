import * as path from 'path';
import { promises as fs } from 'fs';
import {
  Migrator,
  FileMigrationProvider,
  NO_MIGRATIONS,
  NoMigrations,
} from 'kysely';
import { config } from 'dotenv';
import { database } from '../datasource';
import { Logger } from 'src/shared/logger/logger';

config();

async function migrateTo(
  targetMigration: string | NoMigrations = NO_MIGRATIONS
) {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'src/database/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateTo(targetMigration);

  results?.forEach((migrationResult) => {
    if (migrationResult.status === 'Success') {
      if (migrationResult.direction === 'Up') {
        Logger.info(
          `Migration "${migrationResult.migrationName}" was applied successfully`
        );
      } else if (migrationResult.direction === 'Down') {
        Logger.info(
          `Migration "${migrationResult.migrationName}" was reverted successfully`
        );
      }
    } else if (migrationResult.status === 'Error') {
      Logger.error(
        `Failed to apply/revert migration "${migrationResult.migrationName}"`
      );
    }
  });

  if (error) {
    Logger.error('Failed to apply/revert migrations');
    Logger.error(error);
    process.exit(1);
  }

  await database.destroy();
}

const targetMigration = process.argv[2];

Logger.info('targetMigration', targetMigration);

migrateTo(targetMigration);
