import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';
import { AppModule } from './app/app.module';
import { ValidationException } from './app/shared/filters/validation.exception';
import { ValidationFilter } from './app/shared/filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.use(json({ limit: '50mb' }));

  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors();

  const port = process.env.PORT || 9000;

  app.useGlobalFilters(new ValidationFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has wrong value: ${error.value}, ${Object.values(
              error.constraints
            ).join(', ')}`
        );
        return new ValidationException(messages);
      },
    })
  );

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
