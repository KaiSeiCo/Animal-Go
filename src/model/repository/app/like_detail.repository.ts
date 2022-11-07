import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeDetailRepository extends Repository<LikeDetail> {
  constructor(
    @InjectRepository(LikeDetail)
    repository: Repository<LikeDetail>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
