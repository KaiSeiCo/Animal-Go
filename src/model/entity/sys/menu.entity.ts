import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_menu' })
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  @ApiProperty()
  id: number;

  @Column({
    nullable: true,
    type: 'int',
    unsigned: true,
    comment: '父级菜单id',
  })
  @ApiProperty()
  @Index()
  parent_id: number;

  @Column({
    type: 'varchar',
    comment: '菜单名称',
  })
  @ApiProperty()
  name: string;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '菜单路由',
  })
  @ApiProperty()
  router: string;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '菜单权限',
  })
  @ApiProperty()
  perms: string;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '类型 0-导航 1-底级导航(关联url) 2-按钮',
  })
  @ApiProperty()
  type: number;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '按钮/菜单图标',
  })
  icon: string;

  @Column({
    nullable: true,
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  order_num: number;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: '页面路径',
  })
  view_path: string;

  @Column({
    nullable: true,
    type: 'boolean',
    default: true,
  })
  keepalive: boolean;

  @Column({
    nullable: true,
    type: 'boolean',
    default: true,
    comment: '是否显示',
  })
  is_show: boolean;
}
