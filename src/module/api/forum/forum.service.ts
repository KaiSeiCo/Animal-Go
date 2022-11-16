import { Injectable } from '@nestjs/common';
import {
  ForumCreateDto,
  ForumPageQueryDto,
  ForumQueryDto,
} from 'src/module/api/forum/forum.dto';
import { ForumRepository } from 'src/model/repository/app/forum.repository';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { Forum } from 'src/model/entity/app/forum.entity';
import { ForumVo } from 'src/model/vo/article.vo';

@Injectable()
export class ForumService {
  constructor(private forumRepository: ForumRepository) {}

  /**
   * all
   * @param dto
   * @returns
   */
  async list(dto: ForumQueryDto): Promise<Forum[]> {
    const where = {};

    if (dto.forum_type) {
      Object.assign(where, {
        forum_type: dto.forum_type,
      });
    }

    const forums = await this.forumRepository.find({
      where: where,
    });
    return forums;
  }

  /**
   * page query
   * @param dto
   * @returns
   */
  async page(dto: ForumPageQueryDto): Promise<ForumVo[]> {
    const { forum_name, forum_type, page, limit } = dto;

    const basicSql = buildDynamicSqlAppendWhere(
      this.forumRepository.createQueryBuilder('forum').select(
        `
          forum.id as id,
          forum.forum_name as forum_name,
          forum.forum_type as forum_type,
        `,
      ),
      [
        {
          field: 'forum_name',
          condition: 'LIKE',
          value: forum_name,
        },
        {
          field: 'forum_type',
          condition: '=',
          value: forum_type,
        },
      ],
    );

    const forums: ForumVo[] = await basicSql
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return forums;
  }

  /**
   * add new forum
   * @param dto
   */
  async add(dto: ForumCreateDto) {
    const { forum_name, forum_type } = dto;
    await this.forumRepository.insert({
      forum_name: forum_name,
      forum_type: forum_type,
    });
  }

  /**
   * delete forum by id
   * @param id
   */
  async deleteById(id: number) {
    await this.forumRepository.delete({
      id,
    });
  }
}
