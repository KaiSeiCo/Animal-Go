import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/model/entity/sys/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
