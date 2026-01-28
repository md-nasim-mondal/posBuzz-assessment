import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './app/modules/users/users.service';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    logger: isProduction ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Automatic Seeding
  const usersService = app.get(UsersService);
  await usersService.seedAdmin();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
