import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.setup';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  logger.log('Aplicación iniciada');

  app.setGlobalPrefix('api/v1', {
    exclude: ['/', '/docs', '/docs/*path', '/health'],
  });
  logger.log('Prefijo global establecido a /api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: [
      'https://project-x-frontend-nu.vercel.app',
      'http://localhost:4200',
      'https://project-x-frontend-l6tfew3qj-bryantmagiks-projects.vercel.app',
    ],
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });
  setupSwagger(app);
  logger.log('Swagger configurado');

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port);
  logger.log(`Servidor escuchando en el puerto ${port}`);
}
bootstrap();
