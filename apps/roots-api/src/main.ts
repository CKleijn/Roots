import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.enableCors();

  const port = process.env.PORT || 9000;

  //TODO: Add custom entity validation

  // app.useGlobalFilters(new ValidationFilter());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     skipMissingProperties: true,
  //     exceptionFactory: (errors: ValidationError[]) => {
  //       const messages = errors.map(
  //         (error) =>
  //           `${error.property} has wrong value: ${error.value}, ${Object.values(
  //             error.constraints
  //           ).join(', ')}`
  //       );
  //       return new ValidationException(messages);
  //     },
  //   })
  // );

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
