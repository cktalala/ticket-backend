import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}).join(', '))
          .filter((message) => message);
        return new BadRequestException(messages);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
