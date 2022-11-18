import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { ArticleService } from 'src/module/api/article/article.service';

@ApiTags('服务管理')
@ApiBearerAuth()
@Controller('/articles')
export class ArticleManagerController {
  constructor(private articleService: ArticleService) {}

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
}
