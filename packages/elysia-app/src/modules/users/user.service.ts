import { UserRepository } from './infrastructure/user.repository';
import { QueryUser, UpdateUser } from './infrastructure/user.entity';
import { BaseService } from '../../shared/types/base/base.service';

export class UserService extends BaseService {
  constructor(private userRepository: UserRepository) {
    super();
  }

  findManyWithPagination(query: QueryUser) {
    return this.userRepository.findManyWithPagination(query);
  }

  findOne({ id, tenantId }: { id: string; tenantId?: string }) {
    return this.userRepository.findOne({
      where: [{ column: 'id', operator: '=', value: id }],
      tenantId,
    });
  }

  update(id: string, data: UpdateUser) {
    return this.userRepository.update(id, data);
  }

  delete(id: string) {
    return this.userRepository.delete(id);
  }
}
