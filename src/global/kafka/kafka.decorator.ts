export const SUBSCRIBER_FN_REF_MAP = new Map<string, Function>();
export const SUBSCRIBER_FIXED_FN_REF_MAP = new Map<string, Function>();
export const SUBSCRIBER_OBJ_REF_MAP = new Map<string, Function>();

/**
 * subscribe to a topic
 * @param topic
 * @returns
 */
export function SubscribeTo(topic) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    return descriptor;
  };
}

/**
 * subscribe to a fixed topic
 * @param topic
 * @returns
 */
export function SubscribeToFixedGroup(topic) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_FIXED_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    return descriptor;
  };
}
