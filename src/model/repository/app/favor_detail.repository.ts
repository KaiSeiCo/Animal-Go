import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavorDetail } from 'src/model/entity/app/favor_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavorDetailRepository extends Repository<FavorDetail> {
  constructor(
    @InjectRepository(FavorDetail)
    repository: Repository<FavorDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
