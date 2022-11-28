import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tb_camp' })
export class Camp {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: '128',
    comment: '营地名称',
  })
  camp_name: string;

  @Column({
    type: 'varchar',
    length: '1024',
    comment: '营地描述',
  })
  camp_desc: string;

  @Column({
    type: 'int',
    unsigned: true,
    comment: '容纳人数',
    default: 20,
  })
  camp_capacity: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '营地所属人',
  })
  owner: string;

  @Column({
    type: 'tinyint',
    comment: '是否私人营地',
    default: false,
  })
  personal: boolean;

  @Column({
    type: 'tinyint',
    comment: '是否删除',
    default: false,
  })
  deleted: boolean;
}
