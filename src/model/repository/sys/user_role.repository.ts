import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/model/entity/sys/user_role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    repository: Repository<UserRole>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
