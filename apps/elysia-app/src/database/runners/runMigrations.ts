import * as path from "path";
import { promises as fs } from "fs";
import { Migrator, FileMigrationProvider } from "kysely";
import { config } from "dotenv";
import { database } from "../datasource";

config();

async function migrateToLatest() {
  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), "src/app/database/migrations"),
    }),
    allowUnorderedMigrations: true,
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((migrationResult) => {
    if (migrationResult.status === "Success") {
      console.log(
        `migration "${migrationResult.migrationName}" was executed successfully`
      );
    } else if (migrationResult.status === "Error") {
      console.error(
        `failed to execute migration "${migrationResult.migrationName}"`
      );
    }
  });

  if (error) {
    console.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
