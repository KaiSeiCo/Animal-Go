import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { KafkaPayload, MessageType } from 'src/global/kafka/kafka.interface';
import { KafkaService } from 'src/global/kafka/kafka.service';
import { TEST_TOPIC } from 'src/global/kafka/topic.constants';

@ApiTags('测试模块')
@Controller('test')
export class TestController {
  constructor(private readonly kafkaService: KafkaService) {}

  @ApiOperation({ summary: 'kafka message producer' })
  @OpenApi()
  @Get()
  async send() {
    const payload: KafkaPayload = {
      messageId: '' + new Date().valueOf(),
      body: {
        value: 'Test Message',
      },
      messageType: MessageType.COMMON,
      topicName: TEST_TOPIC,
    };
    const value = await this.kafkaService.sendMessage(TEST_TOPIC, payload);
    console.log('status: ' + value);
    return 200;
  }
}
