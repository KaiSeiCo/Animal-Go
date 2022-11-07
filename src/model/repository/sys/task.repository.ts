import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Task from 'src/model/entity/sys/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    repository: Repository<Task>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
