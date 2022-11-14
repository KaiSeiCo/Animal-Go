import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { ArticleService } from 'src/module/api/article/article.service';
import { ForumCreateDto } from 'src/module/api/forum/forum.dto';
import { ForumService } from 'src/module/api/forum/forum.service';
import { TagCreateDto } from 'src/module/api/tag/tag.dto';
import { TagService } from 'src/module/api/tag/tag.service';

@ApiTags('服务管理模块')
@ApiBearerAuth()
@Controller('')
export class ServiceAdminController {
  constructor(
    private articleService: ArticleService,
    private forumService: ForumService,
    private tagService: TagService,
  ) {}

  /* article */
  @ApiOperation({
    summary: '删除文章',
  })
  @Delete('articles')
  async delete(@Query('id') id: number): Promise<Result<void>> {
    await this.articleService.delete(id);
    return Result.success();
  }

  /* forum */
  @ApiOperation({
    summary: '新增板块',
  })
  @Post('forums')
  async addNewForum(@Body() dto: ForumCreateDto) {
    await this.forumService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除板块',
  })
  @Delete('forums')
  async deleteForumById(@Query('id') id: number) {
    await this.forumService.deleteById(id);
  }

  /* tag */
  @ApiOperation({
    summary: '新增标签',
  })
  @Post('tags')
  async addNewTag(@Body() dto: TagCreateDto): Promise<Result<void>> {
    await this.tagService.add(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '删除标签',
  })
  @Delete('tags')
  async deleteTagById(@Query('id') id: number): Promise<Result<void>> {
    await this.tagService.deleteById(id);
    return Result.success();
  }

  /* comment */

  /* message */

  /* camp */
}
