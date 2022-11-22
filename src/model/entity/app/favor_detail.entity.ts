import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('tb_favor_detail')
export class FavorDetail extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '用户id',
  })
  user_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '文章id',
    nullable: true,
  })
  article_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '图片id',
    nullable: true,
  })
  photo_id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    comment: '是否favor',
    nullable: true,
  })
  deleted: boolean;
}
