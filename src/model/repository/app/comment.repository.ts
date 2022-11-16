import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/model/entity/app/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(
    @InjectRepository(Comment)
    repository: Repository<Comment>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
