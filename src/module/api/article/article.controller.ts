import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin, OpenApi } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import {
  ArticlePublishDto,
  ArticleQueryDto,
} from 'src/module/api/article/article.dto';
import { ArticleListVo } from 'src/model/vo/article.vo';
import { ArticleService } from './article.service';
import { Query } from '@nestjs/common/decorators';

@ApiTags('猫料模块')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(
    private articleService: ArticleService,
    private userCtx: UserContext,
  ) {}

  @ApiOperation({
    summary: '猫料列表',
  })
  @OpenApi()
  @Get('')
  async catfoods(
    @Param() dto: ArticleQueryDto,
  ): Promise<Result<ArticleListVo[]>> {
    const articles = await this.articleService.listArticles(dto);
    return Result.success(articles);
  }

  @ApiOperation({
    summary: '发布猫料',
  })
  @OpenApi()
  @Post('publish')
  async publish(@Body() dto: ArticlePublishDto): Promise<Result<void>> {
    await this.articleService.publishArticle(dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '点赞',
  })
  @OnlyRequireLogin()
  @Post('like')
  async likeOrUnlike(@Query('id') article_id: number): Promise<Result<void>> {
    const user = this.userCtx.get('user');
    await this.articleService.likeOrUnlike(user.id, article_id);
    return Result.success();
  }
}
