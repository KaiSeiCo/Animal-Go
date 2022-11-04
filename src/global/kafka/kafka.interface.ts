import { ModuleMetadata } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';
import { TypeOfArrayOrNot, TypeOfPromiseOrNot } from 'src/common/type/typings';
import { KafkaConsumeEvents } from './topic.constants';

export enum MessageType {
  COMMON = 'common',
  SOCKET = 'socket',
}

export class KafkaPayload<T = any> {
  body: T;
  event: KafkaConsumeEvents;
  messageId: string;
  messageType: MessageType;
  topicName: string;
  createdTime?: string;

  create?(
    messageId: string,
    body: T,
    event: KafkaConsumeEvents,
    messageType: MessageType,
    topicName: string,
  ): KafkaPayload<T> {
    return {
      messageId,
      body,
      event,
      messageType,
      topicName,
      createdTime: new Date().toISOString(),
    };
  }
}

export interface KafkaModuleOptions extends KafkaConfig {
  /**
   * consumer group
   */
  groupId?: string;

  /**
   * random suffix
   */
  randomSuffix?: string;
}

export interface KafkaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => TypeOfPromiseOrNot<TypeOfArrayOrNot<KafkaModuleOptions>>;
  inject?: any[];
}
