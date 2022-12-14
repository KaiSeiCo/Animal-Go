import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { MessageProducer } from 'src/global/kafka/producer/message-producer.service';
import { MessageGateway } from 'src/module/socket/message.gateway';
import { MessagePayload } from './message.dto';
import { MessageService } from './message.service';

@ApiTags('聊天消息模块')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @OpenApi()
  @Post('/test')
  async test(@Query('msg') msg: string) {
    await this.messageService.test(msg);
    return Result.success()
  }
}
