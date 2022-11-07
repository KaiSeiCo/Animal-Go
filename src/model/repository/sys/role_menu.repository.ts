import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMenu } from 'src/model/entity/sys/role_menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleMenuRepository extends Repository<RoleMenu> {
  constructor(
    @InjectRepository(RoleMenu)
    repository: Repository<RoleMenu>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
