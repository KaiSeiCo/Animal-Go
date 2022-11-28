import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_camp_user' })
@Index('camp-user-index', ['camp_id', 'user_id'])
export class CampUser extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  camp_id: string;

  @Column({
    type: 'bigint',
    unsigned: true,
  })
  user_id: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: false,
  })
  deleted: boolean;
}
