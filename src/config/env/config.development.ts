import { DataSourceOptions } from 'typeorm';

export default {
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
  } as DataSourceOptions,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  kafka: {
    brokers: process.env.KAFKA_BROKERS.split(','),
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  },
};
