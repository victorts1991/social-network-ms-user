import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se houver propriedades não permitidas
    transform: true,          // Transforma o payload nos tipos definidos no DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
