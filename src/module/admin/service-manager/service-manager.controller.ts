import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { ForumVo } from 'src/model/vo/article.vo';
import { ArticleService } from 'src/module/api/article/article.service';
import {
  ForumCreateDto,
  ForumPageQueryDto,
} from 'src/module/api/forum/forum.dto';
import { ForumService } from 'src/module/api/forum/forum.service';
import { TagCreateDto } from 'src/module/api/tag/tag.dto';
import { TagService } from 'src/module/api/tag/tag.service';

@ApiTags('服务管理模块')
@ApiBearerAuth()
@Controller('/services/manager')
export class ServiceAdminController {
  constructor(
    private articleService: ArticleService,
    private forumService: ForumService,
    private tagService: TagService,
  ) {}

  /* article */
  @ApiOperation({})
  @Get('/articles')
  async articleList(): Promise<Result<void>> {
    return Result.success();
  }

  @ApiOperation({
    summary: '删除文章',
  })
  @Delete('/articles')
  async deleteArticleById(@Query('id') id: number): Promise<Result<void>> {
    await this.articleService.delete(id);
    return Result.success();
  }

  /* forum */
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

  /* tag */
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
  async deleteTagById(@Query('id') id: number): Promise<Result<void>> {
    await this.tagService.deleteById(id);
    return Result.success();
  }

  /* comment */
  @ApiOperation({
    summary: '评论列表',
  })
  @Get('/comments')
  async commentList(): Promise<Result<void>> {
    return Result.success();
  }

  @ApiOperation({})
  @Delete('/comments')
  async deleteCommentById(@Query('id') id: number): Promise<Result<void>> {
    return Result.success();
  }

  /* message */
  @ApiOperation({
    summary: '消息列表',
  })
  @Get('/messages')
  async messageList(): Promise<Result<void>> {
    return Result.success();
  }

  @ApiOperation({})
  @Delete('/messages')
  async deleteMessageById(@Query('id') id: number): Promise<Result<void>> {
    return Result.success();
  }

  /* camp */
  @ApiOperation({})
  @Get('/camps')
  async campList(): Promise<Result<void>> {
    return Result.success();
  }

  @ApiOperation({})
  @Delete('/camps')
  async deleteCamp(@Query('id') id: number): Promise<Result<void>> {
    return Result.success();
  }
}
