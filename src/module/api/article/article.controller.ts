import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import {
  ArticlePublishDto,
  ArticleQueryDto,
} from 'src/model/dto/app/article.dto';
import { ArticleListVo } from 'src/model/vo/article.vo';
import { ArticleService } from './article.service';

@ApiTags('猫料模块')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

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
  @OpenApi()
  @Post('like/:id')
  async likeOrUnlike(@Param('id') id: number): Promise<Result<void>> {
    await this.articleService.likeOrUnlike(id);
    return Result.success();
  }
}
