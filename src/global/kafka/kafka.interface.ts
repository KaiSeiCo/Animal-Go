import { ModuleMetadata } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';
import { TypeOfArrayOrNot, TypeOfPromiseOrNot } from 'src/common/type/typings';

export enum MessageType {
  COMMON = 'common',
  SOCKET = 'socket',
}

export class KafkaPayload<T = any> {
  body: T;
  messageId: string;
  messageType: MessageType;
  topicName: string;
  createdTime?: string;

  create?(
    messageId: string,
    body: T,
    messageType: MessageType,
    topicName: string,
  ): KafkaPayload<T> {
    return {
      messageId,
      body,
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
}

export interface KafkaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => TypeOfPromiseOrNot<TypeOfArrayOrNot<KafkaModuleOptions>>;
  inject?: any[];
}
