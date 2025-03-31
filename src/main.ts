import { AppConstants } from '@common/constants/app.constant';
import { NodeEnv } from '@common/constants/node-env.constant';
import { ExceptionsFilter } from '@common/exceptions/http-exception.filter';
import { Config } from '@config/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    cors: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)));

  /**
   * @description Global Interceptor
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * @description Global Prefix
   */
  app.setGlobalPrefix(AppConstants.GLOBAL_PREFIX);

  /**
   * @description SwaggerUI
   */

  if (process.env.NODE_ENV !== NodeEnv.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('Troy Docker API Docs')
      .setDescription('Troy Docker API Docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const appDocument = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, appDocument);
  }

  await app.listen(Config.PORT, async () => {
    console.log('Server is listening on ' + (await app.getUrl()));
  });
}
bootstrap();
