import { Injectable } from '@nestjs/common';
import { TagCreateDto, TagPageQueryDto } from 'src/module/api/tag/tag.dto';
import { TagRepository } from 'src/model/repository/app/tag.repository';
import { Tag } from 'src/model/entity/app/tag.entity';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { TagVo } from 'src/model/vo/article.vo';

@Injectable()
export class TagService {
  constructor(private tagRepostiory: TagRepository) {}

  /**
   * query all
   * @returns
   */
  async list(): Promise<Tag[]> {
    return this.tagRepostiory.find();
  }

  /**
   * page query tag
   * @param dto
   * @returns
   */
  async page(dto: TagPageQueryDto): Promise<TagVo[]> {
    const { tag_name, page, limit } = dto;

    const basicSql = buildDynamicSqlAppendWhere(
      this.tagRepostiory.createQueryBuilder('tag').select(
        `
          tag.id as tag_id,
          tag.tag_name as tag_name,
        `,
      ),
      [
        {
          field: 'tag_name',
          condition: 'LIKE',
          value: tag_name,
        },
      ],
    );

    const tags: TagVo[] = await basicSql
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();
    return tags;
  }

  /**
   * add new tag
   * @param dto
   */
  async add(dto: TagCreateDto): Promise<void> {
    await this.tagRepostiory.insert({
      tag_name: dto.tag_name,
    });
  }

  /**
   * delete tag by id
   * @param id
   */
  async deleteById(id: string): Promise<void> {
    await this.tagRepostiory.delete({
      id,
    });
  }
}
