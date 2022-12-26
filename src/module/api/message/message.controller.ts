import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin, OpenApi } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import {
  MessageHistoryDto,
  MessageRecallDto,
  MessageSendDto,
} from './message.dto';
import { MessageService } from './message.service';

@ApiTags('聊天消息模块')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userCtx: UserContext,
  ) {}

  @OpenApi()
  @Post('/test')
  async test(@Query('msg') msg: string) {
    await this.messageService.test(msg);
    return Result.success();
  }

  @OpenApi()
  @Get('/camps/:id')
  async campMessageHistory(
    @Param('id') camp_id: string,
    @Query() dto: MessageHistoryDto,
  ) {
    const messages = await this.messageService.getHistoryMessage(camp_id, dto);
    return Result.success(messages);
  }

  @OnlyRequireLogin()
  @Post('/send')
  async sendMessage(@Body() dto: MessageSendDto) {
    const user = this.userCtx.get('user');
    await this.messageService.sendMessageToCamp(user.id, dto);
    return Result.success();
  }

  @OnlyRequireLogin()
  @Delete('/:id')
  async recallMessage(@Param('id') message_id: string) {
    const user = this.userCtx.get('user');
    await this.messageService.recallMessage(user.id, message_id);
    return Result.success();
  }
}
