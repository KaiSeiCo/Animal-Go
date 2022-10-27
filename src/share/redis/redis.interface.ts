import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Redis, ClusterNode, RedisOptions } from 'ioredis';
import { ClusterOptions } from 'ioredis/built/cluster/ClusterOptions';
import { TypeOfArrayOrNot, TypeOfPromiseOrNot } from 'src/common/type/typings';

export interface RedisModuleOptions extends RedisOptions {
  /**
   * multi client connection, default
   */
  name?: string;

  /**
   * support url
   */
  url?: string;

  /**
   * is cluster
   */
  cluster?: boolean;

  /**
   * cluster node, using cluster is true
   */
  nodes?: ClusterNode[];

  /**
   * cluster options, using cluster is true
   */
  clusterOptions?: ClusterOptions;

  /**
   * call back
   */
  onClientReady?(client: Redis): void;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => TypeOfPromiseOrNot<TypeOfArrayOrNot<RedisModuleOptions>>;
  inject?: any[];
}
