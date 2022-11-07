import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationLog } from 'src/model/entity/sys/opt_log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OperationLogRepository extends Repository<OperationLog> {
  constructor(
    @InjectRepository(OperationLog)
    repository: Repository<OperationLog>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
