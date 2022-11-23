import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { TagCreateDto } from 'src/module/api/tag/tag.dto';
import { TagService } from 'src/module/api/tag/tag.service';

@ApiTags('服务管理')
@ApiBearerAuth()
@Controller('/tags')
export class TagManagerController {
  constructor(private tagService: TagService) {}

  @ApiOperation({
    summary: '标签列表',
  })
  @Get('/tags')
  async TagList(): Promise<Result<void>> {
    return Result.success();
  }

  @ApiOperation({
    summary: '新增标签',
  })
  @Post('/tags')
  async addNewTag(@Body() dto: TagCreateDto): Promise<Result<void>> {
    await this.tagService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除标签',
  })
  @Delete('/tags')
  async deleteTagById(@Query('id') id: string): Promise<Result<void>> {
    await this.tagService.deleteById(id);
    return Result.success();
  }
}
