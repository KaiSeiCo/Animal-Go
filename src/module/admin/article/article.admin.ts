import { Controller, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { UserContext } from 'src/global/context/user.context';
import { ArticleService } from 'src/module/api/article/article.service';

@ApiTags('文章管理')
@ApiBearerAuth()
@Controller('articles')
export class ArticleAdminController {
  constructor(
    private articleService: ArticleService,
    private userCtx: UserContext,
  ) {}

  @ApiOperation({
    summary: '删除文章',
  })
  @Delete('')
  async delete (@Query('id') id: number): Promise<Result<void>> {
    await this.articleService.delete(id)
    return Result.success()
  }
}
