import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from 'src/model/entity/app/forum.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForumRepository extends Repository<Forum> {
  constructor(
    @InjectRepository(Forum)
    repository: Repository<Forum>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
