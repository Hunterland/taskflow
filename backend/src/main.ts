import { HttpExceptionFilter } from './common/filters/http-exception.filters';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 🔹 1. HELMET
  app.use(helmet());

  // 🔹 2. PIPES GLOBAIS (prioridade máxima)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔹 3. CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // 🔹 4. FILTRO DE EXCEÇÕES HTTP
  app.useGlobalFilters(new HttpExceptionFilter());

  // 🔹 5. SWAGGER
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('Taskflow Backend com JWT + Prisma')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  logger.log(`🚀 TaskFlow API: http://localhost:${port}/api`);
  await app.listen(port);
}
bootstrap();
