import { Module } from '@nestjs/common';
import JwtWsGuard from 'src/common/guard/ws.guard';
import { MessageGateway } from './message.gateway';

@Module({
  providers: [JwtWsGuard, MessageGateway],
  exports: [MessageGateway],
})
export class WebsocketModule {}
