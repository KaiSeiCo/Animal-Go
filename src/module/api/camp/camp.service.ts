import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Camp } from 'src/model/entity/app/camp.entity';
import { CampRepository } from 'src/model/repository/app/camp.repository';
import { UUIDGenerator } from 'src/util/uuid.util';
import { BuildCampDto, JoinCampDto } from './camp.dto';
import { CampUserRepository } from 'src/model/repository/app/camp_user.repository';
import { ApiException } from 'src/common/exception/api.exception';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { omitSqlResult } from 'src/util/sql.util';
import { CampUser } from 'src/model/entity/app/camp_user.entity';

@Injectable()
export class CampService {
  constructor(
    private readonly campRepository: CampRepository,
    private readonly campUserRepository: CampUserRepository,
  ) {}

  /**
   * 创建营地
   * @param user_id
   * @param dto
   * @returns
   */
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
    await this.campUserRepository.save({
      camp_id: camp.id,
      user_id,
    });
    return camp;
  }

  /**
   * 加入营地
   * @param user_id
   * @param dto
   * @returns
   */
  async joinCamp(user_id: string, dto: JoinCampDto) {
    const { camp_id } = dto;
    const joined = await this.campUserRepository.findOneBy({
      user_id,
      camp_id,
      deleted: false,
    });

    if (joined) {
      throw new ApiException(HttpResponseKeyMap.ALREADY_JOINED);
    }

    const campUser = await this.campUserRepository.save({
      user_id,
      camp_id,
      deleted: false,
    });

    return omitSqlResult(campUser);
  }

  /**
   * 退出营地
   * @param user_id
   * @param camp_id
   * @returns
   */
  async leaveCamp(user_id: string, camp_id: string) {
    const [camp, joined] = await Promise.all([
      this.campRepository.findOneBy({ id: camp_id }),
      this.campUserRepository.findOneBy({
        user_id,
        camp_id,
      }),
    ]);

    // owner destruct camp
    if (camp.owner === user_id) {
      await Promise.all([
        this.campUserRepository.delete({
          camp_id,
        }),
        this.campRepository.delete({
          id: camp_id,
        }),
      ]);
      return null
    }

    if (!joined) {
      throw new ApiException(HttpResponseKeyMap.OPERATION_FAILED);
    }

    const campUser = await this.campUserRepository.remove(joined);
    return campUser;
  }
}
