import { Injectable } from '@nestjs/common';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { ApiException } from 'src/common/exception/api.exception';
import {
  CreateMenuDto,
  UpdateMenuDto,
} from 'src/module/admin/system/menu/menu.dto';
import { Menu } from 'src/model/entity/sys/menu.entity';
import { MenuRepository } from 'src/model/repository/sys/menu.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  /**
   * find all menus
   * @returns
   */
  async list(): Promise<Menu[]> {
    return await this.menuRepository.find();
  }

  /**
   * create a menu
   * @param menu
   */
  async save(menu: CreateMenuDto) {
    await this.menuRepository.save(menu);
  }

  /**
   * delete menu by id
   * @param id
   */
  async delete(id: number) {
    await this.menuRepository.delete({
      id,
    });
  }

  /**
   * update menu
   * @param dto
   */
  async update(dto: UpdateMenuDto) {
    // check parent id exists
    const parent_menu = await this.menuRepository.find({
      where: { parent_id: dto.parent_id },
    });

    if (!parent_menu) {
      throw new ApiException(HttpResponseKeyMap.PARAMETER_INVALID);
    }

    // update
    await this.menuRepository
      .createQueryBuilder()
      .update(Menu)
      .set(dto)
      .where('id = :id', { id: dto.id })
      .execute();
  }
}
