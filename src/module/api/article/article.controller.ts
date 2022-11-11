import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin, OpenApi } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import {
  ArticlePublishDto,
  ArticleQueryDto,
  ArticleUpdateDto,
} from 'src/module/api/article/article.dto';
import { ArticleListVo } from 'src/model/vo/article.vo';
import { ArticleService } from './article.service';
import { Delete, Put, Query } from '@nestjs/common/decorators';

@ApiTags('文章模块')
@ApiBearerAuth()
@Controller('articles')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private userCtx: UserContext,
  ) {}

  @ApiOperation({
    summary: '首页文章列表',
  })
  @OpenApi()
  @Get('')
  async catfoods(
    @Query() dto: ArticleQueryDto,
  ): Promise<Result<ArticleListVo[]>> {
    const articles = await this.articleService.listArticles(dto);
    return Result.success(articles);
  }

  /* user action */

  @ApiOperation({
    summary: '用户发布文章',
  })
  @OnlyRequireLogin()
  @Post('publish')
  async publish(@Body() dto: ArticlePublishDto): Promise<Result<void>> {
    const user = this.userCtx.get('user')
    await this.articleService.publishArticle(user.id, dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '用户编辑文章',
  })
  @OnlyRequireLogin()
  @Put('/users/@me')
  async editMyArticle(@Body() dto: ArticleUpdateDto): Promise<Result<void>> {
    const user = this.userCtx.get('user')
    await this.articleService.editArticleBySelf(user.id, dto)
    return Result.success();
  }

  @ApiOperation({
    summary: '用户删除文章',
  })
  @OnlyRequireLogin()
  @Delete('/:articleId/users/@me')
  async deleteMyArticle(@Param('articleId') article_id: number): Promise<Result<void>> {
    const user = this.userCtx.get('user')
    await this.articleService.deleteArticleBySelf(user.id, article_id)
    return Result.success();
  }

  @ApiOperation({
    summary: '用户文章列表',
  })
  @OnlyRequireLogin()
  @Get('/users/@me')
  async listMyArticle(@Query() dto: ArticleQueryDto): Promise<Result<void>> {
    const user = this.userCtx.get('user')
    await this.articleService.listArticleBySelf(user.id, dto)
    return Result.success();
  }

  @ApiOperation({
    summary: '点赞',
  })
  @OnlyRequireLogin()
  @Post('/:id/like')
  async likeOrUnlike(@Param('id') article_id: number): Promise<Result<void>> {
    const user = this.userCtx.get('user');
    await this.articleService.likeOrUnlike(user.id, article_id);
    return Result.success();
  }

  @ApiOperation({
    summary: '收藏'
  })
  @OnlyRequireLogin()
  @Post('/:id/favor')
  async favorOrUnfavor(@Param('id') article_id: number): Promise<Result<void>> {
    const user = this.userCtx.get('user')
    await this.articleService.favorOrUnfavor(user.id, article_id)
    return Result.success()
  }
}
