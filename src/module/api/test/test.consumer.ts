import { Injectable } from '@nestjs/common/decorators';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ConsumerService } from 'src/global/kafka/consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}
  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['test'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }
}
