import { database } from 'src/database/datasource';
import { Logger } from 'src/shared/logger/logger';
import {
  DEFAULT_ROLE_PERMISSIONS,
  ROLES,
} from 'src/shared/constants/permissions';

export async function seed() {
  await seedDefaultRoles();
}

async function seedDefaultRoles() {
  Logger.info('Seeding default system roles...');

  const rolesToEnsure = [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT];

  try {
    await database.transaction().execute(async (trx) => {
      for (const roleName of rolesToEnsure) {
        const existing = await trx
          .selectFrom('roles')
          .select(['id', 'name'])
          .where('name', '=', roleName)
          .where('deleted_at', 'is', null)
          .executeTakeFirst();

        const permissions = DEFAULT_ROLE_PERMISSIONS[roleName];

        if (!existing) {
          await trx
            .insertInto('roles')
            .values({
              name: roleName,
              description: `System role: ${roleName}`,
              permissions,
              is_system_role: true,
            })
            .execute();
          Logger.info(`Inserted role: ${roleName}`);
        } else {
          await trx
            .updateTable('roles')
            .set({ permissions, is_system_role: true })
            .where('id', '=', existing.id)
            .execute();
          Logger.info(`Updated role: ${roleName}`);
        }
      }
    });

    Logger.info('Default system roles seeded successfully.');
  } catch (error) {
    Logger.error('Failed to seed default roles ' + error);
    process.exitCode = 1;
  }
}

seed();
