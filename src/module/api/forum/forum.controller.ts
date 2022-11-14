import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { ForumQueryDto } from 'src/module/api/forum/forum.dto';
import { Forum } from 'src/model/entity/app/forum.entity';
import { ForumService } from './forum.service';

@ApiTags('板块模块')
@ApiBearerAuth()
@Controller('forums')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @ApiOperation({
    summary: '查询板块',
  })
  @OpenApi()
  @Get('')
  async list(@Query() dto: ForumQueryDto): Promise<Result<Forum[]>> {
    const forums = await this.forumService.list(dto);
    return Result.success(forums);
  }
}
