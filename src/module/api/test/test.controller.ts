import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { ProducerService } from 'src/global/kafka/producer.service';

@ApiTags('测试模块')
@Controller('test')
export class TestController {
  constructor(private readonly producerService: ProducerService) {}

  @ApiOperation({ summary: 'kafka message producer' })
  @OpenApi()
  @Get()
  async kafkaProducer() {
    await this.producerService.produce({
      topic: 'test',
      messages: [
        {
          value: 'Hello world',
        },
      ],
    });

    return 200;
  }
}
