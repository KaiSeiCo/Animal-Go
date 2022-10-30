import { ModuleMetadata } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';
import { TypeOfArrayOrNot, TypeOfPromiseOrNot } from 'src/common/type/typings';

export class KafkaPayload {
  body: any;
  messageId: string;
  messageType: string;
  topicName: string;
  createdTime?: string;

  create?(messageId, body, messageType, topicName): KafkaPayload {
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
