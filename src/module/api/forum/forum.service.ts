import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { toNumber } from "lodash";
import { ForumCreateDto, ForumQueryDto } from "src/model/dto/app/forum.dto";
import { Forum } from "src/model/entity/app/forum.entity";
import { Repository } from "typeorm";

@Injectable()
export class ForumService {

  constructor(
    @InjectRepository(Forum)
    private forumRepository: Repository<Forum>
  ){}

  async list(dto: ForumQueryDto) {

    const where = {}

    if (dto.forum_type) {
      Object.assign(where, {
        forum_type: dto.forum_type
      })
    }

    const forums = await this.forumRepository.find({
      where: where
    })
    return forums
  }

  async add(dto: ForumCreateDto) {
    const { forum_name, forum_type } = dto
    const result = await this.forumRepository.insert({
      forum_name: forum_name,
      forum_type: forum_type
    })
    console.log(result)
  }
}