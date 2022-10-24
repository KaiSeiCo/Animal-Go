import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_role_menu' })
export class RoleMenu extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  @ApiProperty()
  id: number;

  @Column({
    type: 'int',
    unsigned: true,
    comment: '角色id',
  })
  @ApiProperty()
  @Index()
  role_id: number;

  @Column({
    type: 'int',
    unsigned: true,
    comment: '菜单id',
  })
  @ApiProperty()
  menu_id: number;
}
