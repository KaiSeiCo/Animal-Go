import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_user' })
@Index('username-status-index', ['username', 'status'])
export default class User extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
  })
  @ApiProperty()
  id: string;

  @Column({
    comment: '用户名',
    unique: true,
  })
  @ApiProperty()
  @Index('username-index', { unique: true })
  username: string;

  @Column({
    comment: '密码',
  })
  @ApiProperty()
  password: string;

  @Column({
    nullable: true,
    comment: '昵称',
  })
  @ApiProperty()
  nickname: string;

  @Column({
    nullable: true,
    length: 1024,
    comment: '邮箱',
  })
  @ApiProperty()
  email: string;

  @Column({
    nullable: true,
    comment: '头像',
  })
  @ApiProperty()
  avatar: string;

  @Column({
    nullable: true,
    length: 128,
    comment: '个性签名',
  })
  @ApiProperty()
  intro: string;

  @Column({
    type: 'boolean',
    nullable: true,
    comment: '1正常 0禁用',
  })
  @ApiProperty()
  status: boolean;
}
