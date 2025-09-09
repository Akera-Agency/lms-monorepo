import { UserRepository } from './infrastructure/user.repository';
import { QueryUser, UpdateUser } from './infrastructure/user.entity';
import { BaseService } from '../../shared/types/base/base.service';
import { eventBus } from 'src/core/event-bus';
import { AppError } from 'src/shared/Errors/AppError';

export class UserService extends BaseService {
  constructor(private userRepository: UserRepository) {
    super();
  }

  async findManyWithPagination(query: QueryUser) {
    return await this.userRepository.findManyWithPagination(query);
  }

  async findOne({ id, tenantId }: { id: string; tenantId?: string }) {
    const user = await this.userRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
      tenantId,
    });
    if (!user) {
      throw new AppError({
        error: 'user_not_found',
        statusCode: 404,
      });
    }
    return user;
  }

  async update(id: string, data: UpdateUser) {
    const oldUser = await this.findOne({ id });
    const user = await this.userRepository.update(id, data);
    eventBus.emit('user:updated', { newUser: user, oldUser });
    return user;
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }
}
