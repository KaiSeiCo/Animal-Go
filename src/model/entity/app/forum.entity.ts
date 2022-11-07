import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_forum' })
export class Forum extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    comment: '板块名',
  })
  forum_name: string;

  @Column({
    type: 'tinyint',
    comment: '板块所发布类型(0 article, 1 photo)',
  })
  forum_type: number;
}
