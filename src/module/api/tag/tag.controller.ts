import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Delete, Param } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { TagCreateDto } from 'src/module/api/tag/tag.dto';
import { Tag } from 'src/model/entity/app/tag.entity';
import { TagService } from './tag.service';

@ApiTags('标签模块')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @ApiOperation({
    summary: '标签列表',
  })
  @OpenApi()
  @Get('')
  async list(): Promise<Result<Tag[]>> {
    const tags = await this.tagService.list();
    return Result.success(tags);
  }

  @ApiOperation({
    summary: '新增标签',
  })
  @OpenApi()
  @Post('')
  async addNewTag(@Body() dto: TagCreateDto): Promise<Result<void>> {
    await this.tagService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除标签',
  })
  @OpenApi()
  @Delete('')
  async deleteTagById(@Query('id') id: number): Promise<Result<void>> {
    await this.tagService.deleteById(id);
    return Result.success();
  }
}
