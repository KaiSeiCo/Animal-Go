import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OnlyRequireLogin } from "src/common/decorator/auth.decorator";
import { CommentDto } from "./comment.dto";

@ApiTags('评论模块')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {

  @ApiOperation({
    summary: '评论文章'
  })
  @OnlyRequireLogin()
  @Post('')
  async commentToArticle(@Body() dto: CommentDto) {

  }

  @ApiOperation({
    summary: '用户删除评论'
  })
  @OnlyRequireLogin()
  @Delete('/:id')
  async deleteComment(@Param('id') comment_id: number) {}
}