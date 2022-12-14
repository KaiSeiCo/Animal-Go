export enum ConsumerTopics {
  TEST_TOPIC = 'test.topic',
  ARTICLE_TOPIC = 'article.topic',
  MESSAGE_TOPIC = 'message.topic',
}

export enum FixedConsumerTopics {
  TEST_FIXED_TOPIC = 'test.fixed.topic',
}

export enum KafkaConsumeEvents {
  ARTICLE_LIKE = 'article.like',
  ARTICLE_FAVOR = 'article.favor',
  MESSAGE_SEND = 'message.send',
}
