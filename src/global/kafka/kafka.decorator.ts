import { ConsumerTopics, FixedConsumerTopics } from './topic.constants';

export const SUBSCRIBER_TOPIC_EVENT_MAP = new Set<string>();
export const SUBSCRIBER_FIXED_TOPIC_EVENT_MAP = new Set<string>();

/**
 * subscribe to consumer topic
 * @param topic
 * @param event
 * @returns
 */
export function SubscribeToConsumer(topic: ConsumerTopics) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    SUBSCRIBER_TOPIC_EVENT_MAP.add(topic);

    return descriptor;
  };
}

/**
 * subscribe to fixed consumer topic
 * @param topic
 * @param event
 * @returns
 */
export function SubscribeToFixedConsumer(topic: FixedConsumerTopics) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    SUBSCRIBER_FIXED_TOPIC_EVENT_MAP.add(topic);
    return descriptor;
  };
}
