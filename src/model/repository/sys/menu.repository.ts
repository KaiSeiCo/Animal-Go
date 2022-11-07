import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRepository extends Repository<Menu> {
  constructor(
    @InjectRepository(Menu)
    repository: Repository<Menu>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
