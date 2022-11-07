import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/model/entity/app/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(
    @InjectRepository(Article)
    repository: Repository<Article>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
