import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagCreateDto } from 'src/model/dto/app/tag.dto';
import { Tag } from 'src/model/entity/app/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepostiory: Repository<Tag>,
  ) {}

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
