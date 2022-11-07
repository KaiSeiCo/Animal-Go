import { Module } from '@nestjs/common';
import { DynamicModule, ExistingProvider } from '@nestjs/common/interfaces';
import { AdminModule } from 'src/module/admin/admin.module';
import { ArticleCronJob } from './job/article.job';

const providers = [ArticleCronJob];

function createAliasProviders(): ExistingProvider[] {
  const aliasProviders: ExistingProvider[] = [];
  for (const provider of providers) {
    aliasProviders.push({
      provide: provider.name,
      useExisting: provider,
    });
  }
  return aliasProviders;
}

@Module({})
export class MissionModule {
  static forRoot(): DynamicModule {
    const aliasProviders = createAliasProviders();
    return {
      global: true,
      module: MissionModule,
      imports: [AdminModule],
      providers: [...providers, ...aliasProviders],
      exports: aliasProviders,
    };
  }
}
