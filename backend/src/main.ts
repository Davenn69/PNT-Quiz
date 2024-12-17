import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIOAdapter } from './socket-io-adapter';
import { AllExceptionsFilter } from './exception-filter';

function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Neo Acad')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

function setupCors(app: INestApplication) {
  app.enableCors();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  setupCors(app);
  setupDocs(app);

  app.useWebSocketAdapter(new SocketIOAdapter(app));
  app.useGlobalFilters(new AllExceptionsFilter());

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  await app.listen(8000);
}
bootstrap();
