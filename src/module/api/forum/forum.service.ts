import { Injectable } from '@nestjs/common';
import { ForumCreateDto, ForumQueryDto } from 'src/module/api/forum/forum.dto';
import { ForumRepository } from 'src/model/repository/app/forum.repository';

@Injectable()
export class ForumService {
  constructor(private forumRepository: ForumRepository) {}

  async list(dto: ForumQueryDto) {
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

  async add(dto: ForumCreateDto) {
    const { forum_name, forum_type } = dto;
    await this.forumRepository.insert({
      forum_name: forum_name,
      forum_type: forum_type,
    });
  }

  async deleteById(id: number) {
    await this.forumRepository.delete({
      id,
    });
  }
}
