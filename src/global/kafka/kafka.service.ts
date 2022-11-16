import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Consumer, Kafka, Partitioners, Producer } from 'kafkajs';
import { KAFKA_MODULE_OPTIONS } from 'src/common/constant/module.constants';
import {
  SUBSCRIBER_FIXED_TOPIC_EVENT_MAP,
  SUBSCRIBER_TOPIC_EVENT_MAP,
} from './kafka.decorator';
import { KafkaModuleOptions, KafkaPayload } from './kafka.interface';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private fixedConsumer: Consumer;

  constructor(
    @Inject(KAFKA_MODULE_OPTIONS)
    private readonly options: KafkaModuleOptions,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * create kafka client and bind when module init
   */
  async onModuleInit(): Promise<void> {
    // connect to kafka client
    this.createClient();
    await this.connect();

    // attach func with kafka topic name
    SUBSCRIBER_TOPIC_EVENT_MAP.forEach((_, topic) => {
      this.bindTopicToConsumer(topic);
    });
    SUBSCRIBER_FIXED_TOPIC_EVENT_MAP.forEach((_, topic) => {
      this.bindTopicToFixedConsumer(topic);
    });

    await this.fixedConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString()) as KafkaPayload;
        this.eventEmitter.emit(payload.event, payload.body);
      },
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString()) as KafkaPayload;
        this.eventEmitter.emit(payload.event, payload.body);
      },
    });
  }

  /**
   * disconnect kafka client when module destroy
   */
  async onModuleDestroy() {
    await this.disconnect();
  }

  /**
   * init kafka client, producers and consumers
   */
  createClient() {
    this.kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.consumer = this.kafka.consumer({
      groupId: this.options.groupId + this.options.randomSuffix,
    });
    this.fixedConsumer = this.kafka.consumer({
      groupId: this.options.groupId,
    });
  }

  /**
   * subscribe to topic
   * @param _ func
   * @param _topic  topic_name
   */
  async bindTopicToConsumer(_topic: string) {
    await this.consumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  /**
   * subscribe to fixed topic
   * @param _ func
   * @param _topic topic_name
   */
  async bindTopicToFixedConsumer(_topic: string) {
    await this.fixedConsumer.subscribe({
      topic: _topic,
      fromBeginning: false,
    });
  }

  /**
   *
   * @param consumer
   * @param topics
   */
  async subscribeToTopic(consumer: Consumer, ...topics: string[]) {
    await Promise.all([
      topics.forEach((topic) => {
        consumer.subscribe({ topic, fromBeginning: false });
      }),
    ]);
  }

  /**
   * produce message to queue
   * @param topic
   * @param payload
   * @returns
   */
  async sendMessage<T>(topic: string, payload: KafkaPayload<T>) {
    await this.producer.connect();
    const metadata = await this.producer
      .send({
        topic: topic,
        messages: [{ value: JSON.stringify(payload) }],
      })
      .catch((e) => console.error(e.message, e));
    await this.producer.disconnect();
    return metadata;
  }

  /**
   * connect
   */
  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.fixedConsumer.connect();
  }

  /**
   * disconnect
   */
  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.fixedConsumer.disconnect();
  }
}
