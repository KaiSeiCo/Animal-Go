import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { ForumVo } from 'src/model/vo/article.vo';
import {
  ForumCreateDto,
  ForumPageQueryDto,
} from 'src/module/api/forum/forum.dto';
import { ForumService } from 'src/module/api/forum/forum.service';

@ApiTags('服务管理')
@ApiBearerAuth()
@Controller('/forums')
export class ForumManagerController {
  constructor(private forumService: ForumService) {}

  @ApiOperation({
    summary: '',
  })
  @Get('/forums')
  async forumList(@Query() dto: ForumPageQueryDto): Promise<Result<ForumVo[]>> {
    const forums = await this.forumService.page(dto);
    return Result.success(forums);
  }

  @ApiOperation({
    summary: '新增板块',
  })
  @Post('/forums')
  async addNewForum(@Body() dto: ForumCreateDto) {
    await this.forumService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除板块',
  })
  @Delete('/forums')
  async deleteForumById(@Query('id') id: number): Promise<Result<void>> {
    await this.forumService.deleteById(id);
    return Result.success();
  }
}
