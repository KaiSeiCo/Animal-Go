import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/model/entity/app/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag)
    repository: Repository<Tag>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
