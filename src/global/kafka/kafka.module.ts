import { DynamicModule, Module, Provider } from '@nestjs/common';
import { KAFKA_MODULE_OPTIONS } from 'src/common/constant/module.constants';
import { ConsumerService } from './consumer/consumer.service';
import { KafkaModuleAsyncOptions, KafkaModuleOptions } from './kafka.interface';
import { KafkaService } from './kafka.service';

@Module({})
export class KafkaModule {
  static register(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KafkaService,
          useValue: new KafkaService(options),
        },
      ],
      exports: [KafkaService],
    };
  }

  /**
   * provide kafka service
   * @param options
   * @returns
   */
  static registerAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: options.imports ?? [],
      providers: [this.createAsyncOptions(options), KafkaService],
      exports: [KafkaService],
    };
  }

  /**
   * provide kafka module options
   * @param options
   * @returns
   */
  private static createAsyncOptions(
    options: KafkaModuleAsyncOptions,
  ): Provider<any> {
    return {
      provide: KAFKA_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
}
