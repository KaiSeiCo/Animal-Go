import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { MessageService } from './message.service';

@ApiTags('聊天消息模块')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @OpenApi()
  sendMessage() {
    this.messageService.sendMessage('test');
  }
}
