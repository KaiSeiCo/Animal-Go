import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../../model/entity/sys/user.entity';
import { Repository } from 'typeorm';
import {
  UpdateUserDto,
  UserLoginDto,
  UserQueryDto,
  UserRegisterDto,
} from 'src/module/admin/user/user.dto';
import { ApiException } from 'src/common/exception/api.exception';
import { bcryptPassword, comparePassword } from 'src/util/bcrypt.util';
import { Snowflake } from 'nodejs-snowflake';
import { isEmpty, toNumber } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { LoginVo, UserListVo } from 'src/model/vo/user.vo';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { UserRole } from 'src/model/entity/sys/user_role.entity';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { RoleMenu } from 'src/model/entity/sys/role_menu.entity';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { Role } from 'src/model/entity/sys/role.entity';
import { JwtUtil } from 'src/util/jwt.util';
import { RedisService } from 'src/global/redis/redis.service';
import { getLoginRecordKey } from 'src/global/redis/redis.key';
import { REDIS_EXPIRE_TIME_WEEK } from 'src/common/constant/system.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleMenu)
    private roleMenuRepository: Repository<RoleMenu>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
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
    const userRole = await this.userRoleRepo.findOne({
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
    const queryBase = this.userRepository.createQueryBuilder('user');
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
      this.userRepository.update(id, {
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
