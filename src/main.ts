import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerExceptionFilter } from './filters/throttler-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //validation pipe to validate incoming requests bodies autiomatically
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Automatically strip properties that do not have any decorators
      forbidNonWhitelisted: true, 
      disableErrorMessages: false, // Set to true in production for security
    }),
  )
    app.useGlobalFilters(new ThrottlerExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
