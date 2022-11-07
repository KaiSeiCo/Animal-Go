import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleTagRepository extends Repository<ArticleTag> {
  constructor(
    @InjectRepository(ArticleTag)
    repository: Repository<ArticleTag>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
