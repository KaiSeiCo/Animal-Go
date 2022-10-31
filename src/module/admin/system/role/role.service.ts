import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { difference, filter, includes } from 'lodash';
import { CreateRoleDto, UpdateRoleDto } from 'src/model/dto/sys/role.dto';
import { Role } from 'src/model/entity/sys/role.entity';
import { RoleMenu } from 'src/model/entity/sys/role_menu.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(RoleMenu)
    private readonly roleMenuRepo: Repository<RoleMenu>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * find all roles
   * @returns
   */
  async list(): Promise<Role[]> {
    return await this.roleRepo.find();
  }

  /**
   * create a role
   * @param dto
   */
  async save(dto: CreateRoleDto) {
    await this.roleRepo.save(dto);
  }

  /**
   * delete role by id
   * @param id
   */
  async delete(id: number) {
    await this.roleRepo.delete({
      id,
    });
  }

  /**
   * update role and role_menu
   * @param dto
   * @returns
   */
  async update(dto: UpdateRoleDto) {
    const { id, role_name, role_label, remark, menus } = dto;
    // save updated role, find relative menus
    const [role, originMenus] = await Promise.all([
      this.roleRepo.save({
        id,
        role_name,
        role_label,
        remark,
      }),
      this.roleMenuRepo.find({
        where: { role_id: id },
      }),
    ]);
    const originMenuIds = originMenus.map((row) => {
      return row.menu_id;
    });
    // menu need to insert
    const insertMenu = difference(menus, originMenuIds)
      .filter((menu_id) => !!menu_id)
      .map((menu_id) => {
        return {
          role_id: id,
          menu_id,
        };
      });
    // menu need to delete
    const deleteMenu = difference(originMenuIds, menus);
    const deleteRoleMenuFieldIds = filter(originMenus, (e) => {
      return includes(deleteMenu, e.menu_id);
    }).map((e) => {
      return e.id;
    });

    // start transaction
    await this.entityManager.transaction(async (manager) => {
      Promise.all([
        insertMenu.length > 0
          ? await manager.insert(RoleMenu, insertMenu)
          : null,
        deleteMenu.length > 0
          ? await manager.delete(RoleMenu, deleteRoleMenuFieldIds)
          : null,
      ]);
    });
    // [TODO-RECORD-221023]
    // should force logout relavant user

    return role;
  }
}
