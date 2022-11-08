import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import IORedis, { Redis, Cluster } from 'ioredis';
import { isEmpty } from 'lodash';
import {
  REDIS_CLIENT,
  REDIS_DEFAULT_CLIENT_KEY,
  REDIS_MODULE_OPTIONS,
} from 'src/common/constant/module.constants';
import { TypeOfArrayOrNot } from 'src/typings';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

@Module({})
export class RedisModule implements OnModuleDestroy {
  /**
   * @desc register dynamic module redis in nest
   */
  static register(
    options: TypeOfArrayOrNot<RedisModuleOptions>,
  ): DynamicModule {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      providers: [
        clientProvider,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [clientProvider],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const clientProvider = this.createAsyncProvider();
    return {
      module: RedisModule,
      imports: options.imports ?? [],
      providers: [clientProvider, this.createAsyncClientOptions(options)],
      exports: [clientProvider],
    };
  }

  /**
   * @desc create provider
   */
  private static createAsyncProvider(): Provider {
    // create client
    return {
      provide: REDIS_CLIENT,
      useFactory: (
        options: TypeOfArrayOrNot<RedisModuleOptions>,
      ): Map<string, Redis | Cluster> => {
        const clients = new Map<string, Redis | Cluster>();
        if (Array.isArray(options)) {
          options.forEach((op) => {
            const name = op.name ?? REDIS_DEFAULT_CLIENT_KEY;
            if (clients.has(name)) {
              throw new Error('redis Init Error: deplicated redis name');
            }
            clients.set(name, this.createClient(op));
          });
        }
        // if not array, create single redis instance
        else {
          clients.set(REDIS_DEFAULT_CLIENT_KEY, this.createClient(options));
        }
        return clients;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
  }

  /**
   * @desc create redis instance
   */
  private static createClient(options: RedisModuleOptions): Redis | Cluster {
    const { onClientReady, url, cluster, clusterOptions, nodes, ...opts } =
      options;
    let client = null;
    // check url
    if (!isEmpty(url)) {
      client = new IORedis(url);
    }
    // check cluster
    else if (cluster) {
      client = new IORedis.Cluster(nodes, clusterOptions);
    } else {
      client = new IORedis(opts);
    }

    if (onClientReady) {
      onClientReady(client);
    }
    return client;
  }

  private static createAsyncClientOptions(
    options: RedisModuleAsyncOptions,
  ): Provider<any> {
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  onModuleDestroy() {
    // on destroy
  }
}
