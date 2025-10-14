import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Configuración básica de Swagger
  const config = new DocumentBuilder()
    .setTitle('Tickets API')
    .setDescription('API para gestión de tickets, usuarios, edificios, etc.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger se verá en http://localhost:3000/api

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
