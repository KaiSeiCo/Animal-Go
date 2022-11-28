import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampUser } from 'src/model/entity/app/camp_user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CampUserRepository extends Repository<CampUser> {
  constructor(
    @InjectRepository(CampUser)
    repository: Repository<CampUser>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
