import { Injectable } from '@nestjs/common';
import { TagCreateDto } from 'src/module/api/tag/tag.dto';
import { TagRepository } from 'src/model/repository/app/tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepostiory: TagRepository) {}

  async list() {
    return this.tagRepostiory.find();
  }

  async add(dto: TagCreateDto) {
    await this.tagRepostiory.insert({
      tag_name: dto.tag_name,
    });
  }

  async deleteById(id: number) {
    await this.tagRepostiory.delete({
      id,
    });
  }
}
