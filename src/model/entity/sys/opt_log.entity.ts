import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_opt_log' })
export class OperationLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    unsigned: true,
  })
  @ApiProperty()
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    comment: '操作用户',
  })
  @ApiProperty()
  user_id: number;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '操作路径',
  })
  @ApiProperty()
  path: string;

  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
    comment: '操作类型',
  })
  @ApiProperty()
  method: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '操作ip来源',
  })
  @ApiProperty()
  ip_address: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '操作来源地',
  })
  @ApiProperty()
  ip_source: string;
}
