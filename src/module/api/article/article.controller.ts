import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin, OpenApi } from 'src/common/decorator/auth.decorator';
import {
  ArticlePublishDto,
  ArticleQueryDto,
} from 'src/model/dto/app/article.dto';
import { Article } from 'src/model/entity/app/article.entity';
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
}
