import { TenantRepository } from './infrastructure/tenant.repository';
import { TenantRoleRepository } from './infrastructure/tenant-role.repository';
import {
  NewTenant,
  QueryTenant,
  UpdateTenant,
  TenantEntity,
} from './infrastructure/tenant.entity';
import {
  NewTenantRole,
  TenantRoleEntity,
  UpdateTenantRole,
} from './infrastructure/tenant-role.entity';
import {
  TenantUserEntity,
  QueryTenantUser,
} from './infrastructure/tenant-user.entity';
import { BaseService } from '../../shared/types/base/base.service';
import { AppError } from 'src/shared/Errors/AppError';

export class TenantService extends BaseService {
  constructor(
    private tenantRepository: TenantRepository,
    private tenantRoleRepository: TenantRoleRepository
  ) {
    super();
  }

  // Tenant CRUD operations
  async findManyWithPagination(query: QueryTenant) {
    return this.tenantRepository.findManyWithPagination(query);
  }

  async findOne(id: string): Promise<TenantEntity> {
    const result = await this.tenantRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
    });

    if (result === null) {
      throw new AppError({
        error: 'Tenant not found',
        statusCode: 404,
      });
    }

    return result;
  }

  async create(data: NewTenant): Promise<TenantEntity> {
    return await this.tenantRepository.create(data);
  }

  async update(id: string, data: UpdateTenant): Promise<TenantEntity> {
    return await this.tenantRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.tenantRepository.delete(id);
  }

  async getTenantRoles(tenantId: string): Promise<TenantRoleEntity[]> {
    return await this.tenantRoleRepository.findAll({
      where: [{ column: 'tenant_id', operator: '=', value: tenantId }],
    });
  }

  // Tenant-User operations
  async assignUserToTenant(
    tenantId: string,
    userId: string,
    roleId: string
  ): Promise<TenantUserEntity> {
    return await this.tenantRepository.addUsersToTenant([
      {
        tenant_id: tenantId,
        user_id: userId || '',
        tenant_role_id: roleId,
      },
    ]);
  }

  async removeUserFromTenant(tenantId: string, userId: string): Promise<void> {
    return await this.tenantRepository.removeUsersFromTenant({
      tenant_id: tenantId,
      user_ids: [userId],
    });
  }

  async getTenantUsers(tenantId: string, query: QueryTenantUser) {
    return await this.tenantRepository.getTenantUsersWithInfinityPagination(
      tenantId,
      query
    );
  }

  async updateUserRoleInTenant(
    tenantId: string,
    userId: string,
    roleId: string
  ): Promise<TenantUserEntity> {
    return await this.tenantRepository.updateUserInTenant({
      tenant_id: tenantId,
      user_id: userId,
      tenant_role_id: roleId,
    });
  }

  async removeRoleFromTenant(roleId: string): Promise<void> {
    await this.tenantRoleRepository.delete(roleId);
  }

  async createRoleForTenant(data: NewTenantRole): Promise<TenantRoleEntity> {
    return await this.tenantRoleRepository.create(data);
  }

  async updateRoleForTenant(roleId: string, data: UpdateTenantRole) {
    return await this.tenantRoleRepository.update(roleId, data);
  }
}
