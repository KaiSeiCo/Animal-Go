import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { ForumCreateDto, ForumQueryDto } from 'src/model/dto/app/forum.dto';
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
  async list(@Query() dto: ForumQueryDto) {
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
}
