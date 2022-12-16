import { Injectable } from '@nestjs/common';
import {
  UpdateUserDto,
  UserLoginDto,
  UserQueryDto,
  UserRegisterDto,
} from 'src/module/api/user/user.dto';
import { ApiException } from 'src/common/exception/api.exception';
import { bcryptPassword, comparePassword } from 'src/util/bcrypt.util';
import { Snowflake } from 'nodejs-snowflake';
import { isEmpty } from 'lodash';
import { LoginVo, UserInfoVo } from 'src/model/vo/user.vo';
import { buildDynamicSqlAppendWhere } from 'src/util/sql.util';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { JwtUtil } from 'src/util/jwt.util';
import { RedisService } from 'src/global/redis/redis.service';
import { getLoginRecordKey } from 'src/global/redis/redis.key';
import { REDIS_EXPIRE_TIME_WEEK } from 'src/common/constant/system.constant';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import { UserRoleRepository } from 'src/model/repository/sys/user_role.repository';
import { RoleRepository } from 'src/model/repository/sys/role.repository';
import { RoleMenuRepository } from 'src/model/repository/sys/role_menu.repository';
import { MenuRepository } from 'src/model/repository/sys/menu.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userRoleRepository: UserRoleRepository,
    private roleRepository: RoleRepository,
    private roleMenuRepository: RoleMenuRepository,
    private menuRepository: MenuRepository,
    private redisService: RedisService,
    private jwtUtil: JwtUtil,
  ) {}

  /**
   * login
   * @param loginDto
   * @returns
   */
  async login(loginDto: UserLoginDto): Promise<LoginVo> {
    // valid username
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username, status: true },
    });

    if (isEmpty(user)) {
      throw new ApiException(HttpResponseKeyMap.USER_NOT_EXISTS);
    }

    // compare password
    if (!comparePassword(loginDto.password, user.password)) {
      throw new ApiException(HttpResponseKeyMap.WRONG_PASSWORD);
    }

    // generate token
    const userRole = await this.userRoleRepository.findOne({
      where: { user_id: user.id },
    });

    const [roleMenu, role] = await Promise.all([
      this.roleMenuRepository.find({
        where: { role_id: userRole.role_id },
      }),
      this.roleRepository.findOne({ where: { id: userRole.role_id } }),
    ]);

    const menuIds = roleMenu.filter((rm) => !!rm).map((rm) => rm.menu_id);
    const perms: string[] = (
      await this.menuRepository
        .createQueryBuilder('menu')
        .select('menu.perms as perms')
        .where('menu.id IN (:...ids)', { ids: menuIds })
        .getRawMany()
    ).map((m: Menu) => {
      return m.perms;
    });

    const token = this.jwtUtil.signToken({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar,
      intro: user.intro,
      status: user.status,
      role_id: role.id,
      role_name: role.role_name,
      role_label: role.role_label,
      perms: perms,
    });

    await this.redisService
      .getRedis()
      .setex(getLoginRecordKey(user.id), REDIS_EXPIRE_TIME_WEEK, token);
    return { token };
  }

  /**
   * register
   * @param waitToReg
   * @returns
   */
  async register(waitToReg: UserRegisterDto): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      username: waitToReg.username,
    });

    if (user) {
      throw new ApiException(HttpResponseKeyMap.USER_ALREADY_EXISTS);
    }

    waitToReg.password = bcryptPassword(waitToReg.password);

    const id = new Snowflake()
      .idFromTimestamp(Date.parse(new Date().toString()))
      .toString();

    const result = await this.userRepository.insert({
      id,
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
  async page(query: UserQueryDto): Promise<[UserInfoVo[], number]> {
    const { username, email, status, page, limit } = query;
    const basicSql = buildDynamicSqlAppendWhere(
      this.userRepository.createQueryBuilder('user'),
      [
        {
          field: 'user.username',
          condition: 'LIKE',
          value: username,
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
      ],
    )
      .skip((page - 1) * limit)
      .take(limit);
    const [list, total] = await basicSql.getManyAndCount();
    const result: UserInfoVo[] = list.map((e) => {
      return {
        id: e.id,
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
      this.userRepository.update(id, {
        username,
        password: bcryPassword,
        status,
        email,
      }),
      this.userRoleRepository.findOne({ where: { user_id: id } }),
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
    await this.userRoleRepository.save(userRole);

    // [TODO-RECORD-221023]
    // flush token in redis
    return;
  }
}
