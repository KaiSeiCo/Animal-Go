import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { TagCreateDto } from 'src/model/dto/app/tag.dto';
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
}
