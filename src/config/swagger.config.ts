import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

export function setupSwagger(app: INestApplication): void {
  const configService: ConfigService = app.get(ConfigService);
  // 默认启用
  const enable = configService.get<boolean>('swagger.enable', true);

  if (!enable) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.desc'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    configService.get<string>('swagger.path', '/swagger-api'),
    app,
    document,
  );
}
