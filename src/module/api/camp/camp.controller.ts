import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { CampMessageListVo } from 'src/model/vo/message.vo';
import { MessagePageQueryDto } from '../message/message.dto';
import { MessageService } from '../message/message.service';

@ApiTags('营地模块')
@ApiBearerAuth()
@Controller('camps')
export class CampController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({
    summary: '查询营地消息',
  })
  @OpenApi()
  @Get('/:id')
  async getCampMessages(
    @Param('id') camp_id: string,
    @Query() dto: MessagePageQueryDto,
  ): Promise<Result<CampMessageListVo>> {
    const data = await this.messageService.page(camp_id, dto);
    return Result.success(data);
  }
}
