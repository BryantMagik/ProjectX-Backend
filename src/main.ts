import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Jiru API Documentation')
    .setDescription(' The Jiru API Documentation for the Jiru App.')
    .setVersion('1.5')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      baseUrl: 'api/v1',
    },
  });
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
