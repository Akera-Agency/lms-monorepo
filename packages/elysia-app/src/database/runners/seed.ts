import { database } from 'src/database/datasource';
import { Logger } from 'src/shared/logger/logger';
import { DEFAULT_ROLE_PERMISSIONS, ROLES } from 'src/shared/constants/permissions';
import { LanguagesEnum } from 'src/shared/constants/i18n';
import { supabaseAdmin } from 'src/shared/utils/supabase';

export async function seed() {
  await seedDefaultRoles();
  await seedSuperAdmin();
}

async function seedDefaultRoles() {
  Logger.info('Seeding default system roles...');

  const rolesToEnsure = [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.SUPER_ADMIN];

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

async function seedSuperAdmin() {
  Logger.info('Seeding super admin user...');

  const email = process.env.SUPERADMIN_EMAIL!;
  const password = process.env.SUPERADMIN_PASSWORD!;
  const name = process.env.SUPERADMIN_NAME!;
  const roleName = ROLES.SUPER_ADMIN;

  await database.transaction().execute(async (trx) => {
    const existing = await trx
      .selectFrom('users')
      .select(['id'])
      .where('email', '=', email)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();

    const superAdminRoleId = (
      await trx
        .selectFrom('roles')
        .select('id')
        .where('name', '=', roleName)
        .where('deleted_at', 'is', null)
        .executeTakeFirst()
    )?.id;

    if (!existing) {
      const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
        email,
        user_metadata: {
          name: name,
          role: 'super_admin',
        },
        password,
        email_confirm: true,
      });

      if (!authUser?.user?.id) {
        throw new Error('Supabase failed to return a user ID for super admin');
      }

      if (!superAdminRoleId) {
        throw new Error('Super admin role not found in roles table');
      }

      await trx
        .insertInto('users')
        .values({
          id: authUser.user.id,
          email,
          name: name,
          role_id: superAdminRoleId,
          language: LanguagesEnum.en,
          is_active: true,
        })
        .execute();

      Logger.info(`Super admin user created: ${email}`);
    } else {
      Logger.info(`Super admin already exists: ${email}`);
    }
  });
}

seed();
