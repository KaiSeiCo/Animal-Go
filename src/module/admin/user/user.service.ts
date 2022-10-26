import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../../model/entity/sys/user.entity';
import { Repository } from 'typeorm';
import {
  UpdateUserDto,
  UserLoginDto,
  UserQueryDto,
  UserRegisterDto,
} from 'src/model/dto/sys/user.dto';
import { ApiException } from 'src/common/exception/api.exception';
import { bcryptPassword, comparePassword } from 'src/util/bcrypt.util';
import { Snowflake } from 'nodejs-snowflake';
import { isEmpty, toNumber } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { LoginVo, UserListVo } from 'src/model/vo/user.vo';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { UserRole } from 'src/model/entity/sys/user_role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
    private jwtService: JwtService,
  ) {}

  /**
   * login
   * @param loginDto
   * @returns
   */
  async login(loginDto: UserLoginDto): Promise<LoginVo> {
    const user = await this.userRepo.findOne({
      where: { username: loginDto.username, status: true },
    });

    if (isEmpty(user)) {
      throw new ApiException(41006);
    }
    if (!comparePassword(loginDto.password, user.password)) {
      throw new ApiException(41005);
    }
    // [TODO-RECORD-221023]
    // you may sign token with role and menu resource path, then check them in auth guard
    const token = this.jwtService.sign({
      ...user,
    });

    return { token };
  }

  /**
   * register
   * @param waitToReg
   * @returns
   */
  async register(waitToReg: UserRegisterDto): Promise<boolean> {
    const user = await this.userRepo.findOneBy({
      username: waitToReg.username,
    });

    if (user) {
      throw new ApiException(41006);
    }

    waitToReg.password = bcryptPassword(waitToReg.password);

    const id = new Snowflake()
      .idFromTimestamp(Date.parse(new Date().toString()))
      .toString();

    const result = await this.userRepo.insert({
      id: toNumber(id),
      ...waitToReg,
      status: true,
    });

    return result.identifiers.length > 0;
  }

  /**
   * page query list
   * @param query
   * @returns
   */
  async page(query: UserQueryDto): Promise<[UserListVo[], number]> {
    const { username, email, status, page, limit } = query;
    const queryBase = this.userRepo.createQueryBuilder('user');
    buildDynamicSqlAppendWhere(queryBase, [
      {
        field: 'user.username',
        condition: 'LIKE',
        value: username,
        fuzzy: true,
      },
      {
        field: 'user.email',
        condition: '=',
        value: email,
      },
      {
        field: 'user.status',
        condition: '=',
        value: status,
      },
    ])
      .skip((page - 1) * limit)
      .take(limit);
    const [list, total] = await queryBase.getManyAndCount();
    const result: UserListVo[] = list.map((e) => {
      return {
        username: e.username,
        nickname: e.nickname,
        email: e.email,
        avatar: e.avatar,
        intro: e.intro,
        status: e.status,
      };
    });
    return [result, total];
  }

  /**
   * update user info by superadmin
   * @param dto
   */
  async update(dto: UpdateUserDto): Promise<void> {
    const { id, role_id, username, password, email, status } = dto;
    const bcryPassword = password ? bcryptPassword(password) : undefined;
    const [_, role] = await Promise.all([
      this.userRepo.update(id, {
        username,
        password: bcryPassword,
        status,
        email,
      }),
      this.userRoleRepo.findOne({ where: { user_id: id } }),
    ]);

    const userRole = role
      ? {
          id: role.id,
          user_id: id,
          role_id: role_id,
        }
      : {
          user_id: id,
          role_id: role_id,
        };
    await this.userRoleRepo.save(userRole);

    // [TODO-RECORD-221023]
    // flush token in redis
    return;
  }
}
