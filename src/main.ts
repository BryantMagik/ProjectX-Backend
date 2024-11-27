import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  console.log('Aplicación iniciada...');

  app.setGlobalPrefix('api/v1');
  console.log('Prefijo global establecido a /api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'https://project-x-frontend-eta.vercel.app',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  })
  setupSwagger(app);
  console.log('Swagger configurado');

  await app.listen(parseInt(process.env.PORT) || 3000);
  console.log('Servidor escuchando en el puerto', process.env.PORT || 3000);

}
bootstrap();
