import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Camp } from 'src/model/entity/app/camp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CampRepository extends Repository<Camp> {
  constructor(
    @InjectRepository(Camp)
    repository: Repository<Camp>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
