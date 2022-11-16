import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Get, Query } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin, OpenApi } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import { PageOptionsDto } from 'src/model/dto/page.dto';
import { ArticleCommentVo } from 'src/model/vo/comment.vo';
import { CommentDto } from './comment.dto';
import { CommentService } from './comment.service';

@ApiTags('评论模块')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private readonly userCtx: UserContext,
  ) {}

  @ApiOperation({
    summary: '查询评论',
  })
  @OpenApi()
  @Get('/articles/:id')
  async articleComments(
    @Param('id') article_id: number,
    @Query() pageDto: PageOptionsDto,
  ): Promise<Result<ArticleCommentVo>> {
    const result = await this.commentService.listArticleComments(
      article_id,
      pageDto,
    );
    return Result.success(result);
  }

  @ApiOperation({
    summary: '评论文章',
  })
  @OnlyRequireLogin()
  @Post('')
  async commentToArticle(@Body() dto: CommentDto): Promise<Result<void>> {
    const user = this.userCtx.get('user');
    await this.commentService.comment(user.id, dto);
    return Result.success();
  }

  @ApiOperation({
    summary: '用户删除评论',
  })
  @OnlyRequireLogin()
  @Delete('/:id')
  async deleteComment(@Param('id') comment_id: number): Promise<Result<void>> {
    const user = this.userCtx.get('user');
    await this.commentService.deleteCommentSelf(user.id, comment_id);
    return Result.success();
  }
}
