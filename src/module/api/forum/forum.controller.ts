import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { ForumCreateDto, ForumQueryDto } from 'src/module/api/forum/forum.dto';
import { Forum } from 'src/model/entity/app/forum.entity';
import { ForumService } from './forum.service';

@ApiTags('板块模块')
@ApiBearerAuth()
@Controller('forum')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @ApiOperation({
    summary: '查询板块',
  })
  @OpenApi()
  @Get('')
  async list(@Query() dto: ForumQueryDto): Promise<Result<Forum[]>> {
    const forums = await this.forumService.list(dto);
    return Result.success(forums);
  }

  @ApiOperation({
    summary: '新增板块',
  })
  @OpenApi()
  @Post('')
  async addNewForum(@Body() dto: ForumCreateDto) {
    await this.forumService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除板块',
  })
  @OpenApi()
  @Delete('')
  async deleteForumById(@Query('id') id: number) {
    await this.forumService.deleteById(id);
  }
}
