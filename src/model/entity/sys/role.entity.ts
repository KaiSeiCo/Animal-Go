import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'sys_role' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  @ApiProperty()
  id: number;

  @Column({
    type: 'varchar',
    comment: '角色名称',
  })
  @ApiProperty()
  role_name: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '角色标签',
  })
  @ApiProperty()
  role_label: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '备注',
  })
  @ApiProperty()
  remark: string;
}
