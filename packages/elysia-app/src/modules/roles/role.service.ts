import { RoleRepository } from './infrastructure/role.repository';
import { NewRole, QueryRole, UpdateRole, RoleEntity } from './infrastructure/role.entity';
import { BaseService } from '../../shared/types/base/base.service';
import { BasePermission } from '../../shared/constants/permissions';
import { IDb } from '../../database/types/IDb';
import { AppError } from 'src/shared/Errors/AppError';

export class RoleService extends BaseService {
  constructor(private roleRepository: RoleRepository) {
    super();
  }

  // Role CRUD operations
  async findManyWithPagination(query: QueryRole) {
    return this.roleRepository.findManyWithPagination(query);
  }

  async findOne(id: string): Promise<RoleEntity> {
    const result = await this.roleRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });
    if (!result) {
      throw new AppError({
        error: 'role_not_found',
        statusCode: 404,
      });
    }
    return result;
  }

  async findByUserId(userId: string) {
    const result = await this.roleRepository.findByUserId({
      userId,
    });
    return result;
  }

  async findByName(name: string): Promise<RoleEntity> {
    const result = await this.roleRepository.findOne({
      where: [{ column: 'name', operator: '=', value: name }],
    });
    if (!result) {
      throw new AppError({
        error: 'role_not_found',
        statusCode: 404,
      });
    }
    return result;
  }

  async findSystemRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.findAll({
      where: [{ column: 'is_system_role', operator: '=', value: true }],
    });
  }

  async findCustomRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.findAll({
      where: [{ column: 'is_system_role', operator: '=', value: false }],
    });
  }

  async create(data: NewRole): Promise<RoleEntity> {
    if (data.permissions && !this.validatePermissions(data.permissions)) {
      throw new AppError({
        error: 'invalid_permissions_structure',
        statusCode: 400,
      });
    }

    return await this.roleRepository.create(data);
  }

  async update(id: string, data: UpdateRole): Promise<RoleEntity> {
    const existingRole = await this.findOne(id);
    if (existingRole?.is_system_role && data.is_system_role === false) {
      throw new AppError({
        error: 'cannot_modify_system_roles',
        statusCode: 400,
      });
    }

    if (data.permissions && !this.validatePermissions(data.permissions)) {
      throw new AppError({
        error: 'invalid_permissions_structure',
        statusCode: 400,
      });
    }

    return await this.roleRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existingRole = await this.findOne(id);
    if (existingRole?.is_system_role) {
      throw new AppError({
        error: 'cannot_delete_system_roles',
        statusCode: 400,
      });
    }
    await this.roleRepository.delete(id);
  }

  async hasPermission(
    roleId: string,
    entity: keyof IDb,
    permission: BasePermission,
  ): Promise<boolean> {
    const role = await this.findOne(roleId);
    if (!role) {
      return false;
    }

    const permissions = role.permissions || {};
    const entityPermissions = permissions[entity] || [];

    return entityPermissions.includes(permission);
  }

  private validatePermissions(permissions: Record<string, string[]>): boolean {
    for (const [entity, perms] of Object.entries(permissions)) {
      if (typeof entity !== 'string') {
        return false;
      }

      if (!Array.isArray(perms)) {
        return false;
      }

      for (const perm of perms) {
        if (typeof perm !== 'string') {
          return false;
        }
      }
    }

    return true;
  }
}
