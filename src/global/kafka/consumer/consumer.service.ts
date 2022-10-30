import { Injectable } from '@nestjs/common';
import { SubscribeTo, SubscribeToFixedGroup } from '../kafka.decorator';
import { KafkaPayload } from '../kafka.interface';
import { TEST_FIXED_TOPIC, TEST_TOPIC } from '../topic.constants';

@Injectable()
export class ConsumerService {
  @SubscribeTo(TEST_TOPIC)
  testSubscriber(payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
  }

  @SubscribeTo(TEST_TOPIC + '2')
  testSubscriber2(payload: KafkaPayload) {
    console.log(
      '[KAKFA-CONSUMER] Print message after receiving from fixed group',
      payload,
    );
  }

  @SubscribeToFixedGroup(TEST_FIXED_TOPIC)
  testSubscriberToFixedGroup(payload: KafkaPayload) {
    console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
  }
}
