import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_task' })
export default class Task extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  @ApiProperty()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '任务名称',
  })
  @ApiProperty()
  name: string;

  @Column({
    type: 'varchar',
    comment: '调用服务',
  })
  @ApiProperty()
  service: string;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '任务类型(0定时 1间歇)',
  })
  @ApiProperty()
  type: number;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '任务状态(0停止 1启动)',
  })
  @ApiProperty()
  status: number;

  @Column({
    name: 'start_time',
    type: 'datetime',
    nullable: true,
    comment: '任务开始时间',
  })
  @ApiProperty()
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'datetime',
    nullable: true,
    comment: '任务结束时间',
  })
  @ApiProperty()
  endTime: Date;

  @Column({
    type: 'int',
    nullable: true,
    default: 0,
    comment: '任务执行次数上限(-1不限制)',
  })
  @ApiProperty()
  limit: number;

  @Column({ nullable: true, comment: '定时任务表达式' })
  @ApiProperty()
  cron: string;

  @Column({ type: 'int', nullable: true, comment: '间歇任务执行间隔' })
  @ApiProperty()
  every: number;

  @Column({ type: 'text', nullable: true, comment: '传递参数' })
  @ApiProperty()
  data: string;

  @Column({
    name: 'job_opts',
    type: 'text',
    nullable: true,
    comment: '任务参数',
  })
  @ApiProperty()
  jobOpts: string;

  @Column({ nullable: true })
  @ApiProperty()
  remark: string;
}
