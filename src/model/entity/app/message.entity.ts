import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_message' })
export class Message extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '发送用户id',
  })
  user_id: string;

  @Column({
    type: 'varchar',
    length: 1024,
    comment: '消息内容',
  })
  message_content: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '营地id',
  })
  camp_id: string;

  @Column({
    type: 'bigint',
    unsigned: true,
    nullable: true,
    comment: '回复消息id',
  })
  reply_to: string;

  @Column({
    type: 'tinyint',
    default: false,
    comment: '是否删除',
  })
  deleted: boolean;
}
