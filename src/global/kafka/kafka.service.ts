import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka, Partitioners, Producer } from 'kafkajs';
import { KAFKA_MODULE_OPTIONS } from 'src/common/constant/module.constants';
import {
  SUBSCRIBER_FIXED_FN_REF_MAP,
  SUBSCRIBER_FN_REF_MAP,
  SUBSCRIBER_OBJ_REF_MAP,
} from './kafka.decorator';
import { KafkaModuleOptions, KafkaPayload } from './kafka.interface';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private fixedConsumer: Consumer;
  // random group id, make sure it always consume from latest pos when re-deploy the service
  private readonly consumerSuffix = '-' + Math.floor(Math.random() * 100000);

  constructor(
    @Inject(KAFKA_MODULE_OPTIONS)
    private readonly options: KafkaModuleOptions,
  ) {}

  /**
   * create kafka client and bind  when module init
   */
  async onModuleInit(): Promise<void> {
    // connect to kafka client
    this.createClient();
    await this.connect();

    // attach func with kafka topic name
    SUBSCRIBER_FN_REF_MAP.forEach((funcRef, topic) => {
      this.bindAllTopicToConsumer(funcRef, topic);
    });
    SUBSCRIBER_FIXED_FN_REF_MAP.forEach((funcRef, topic) => {
      this.bindAllTopicToFixedConsumer(funcRef, topic);
    });

    await this.fixedConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const funcRef = SUBSCRIBER_FIXED_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind subscribed func to topic
        await funcRef.apply(object, [message.value.toString()]);
      },
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const funcRef = SUBSCRIBER_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind subscribed func to topic
        await funcRef.apply(object, [message.value.toString()]);
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
      groupId: this.options.groupId + this.consumerSuffix,
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
  async bindAllTopicToConsumer(_: Function, _topic: string) {
    await this.consumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  /**
   * subscribe to fixed topic
   * @param _ func
   * @param _topic topic_name
   */
  async bindAllTopicToFixedConsumer(_: Function, _topic: string) {
    await this.fixedConsumer.subscribe({
      topic: _topic,
      fromBeginning: false,
    });
  }

  /**
   * produce message to queue
   * @param topic
   * @param payload
   * @returns
   */
  async sendMessage(topic: string, payload: KafkaPayload) {
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
