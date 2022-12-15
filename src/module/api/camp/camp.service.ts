import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Camp } from 'src/model/entity/app/camp.entity';
import { CampRepository } from 'src/model/repository/app/camp.repository';
import { UUIDGenerator } from 'src/util/uuid.util';
import { BuildCampDto } from './camp.dto';

@Injectable()
export class CampService {
  constructor(private readonly campRepository: CampRepository) {}

  async createCampByUser(user_id: string, dto: BuildCampDto) {
    const { camp_name, camp_desc, camp_capacity, personal } = dto;
    const code = UUIDGenerator.random();
    const camp: Camp = await this.campRepository.save({
      camp_name,
      camp_desc,
      camp_capacity,
      camp_code: code,
      personal,
      owner: user_id,
    });
    return camp;
  }
}
