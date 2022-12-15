import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export default class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    super.catch(exception, host);
  }
  handleError(client: any, e: WsException) {
    const result = super.handleError(client, e);
    if (client instanceof Socket) {
      client.send(
        JSON.stringify({
          event: 'exception',
          data: {
            status: 500,
            message: e.message,
          },
        }),
      );
    }
    return result;
  }
}
