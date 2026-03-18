import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  /*
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://127.0.0.1:8080", "http://localhost:8080"], // Keycloak e API
      },
    },
  }));
  */
  
  // Requisito: Base URL `https://api.empresa.com/api/v1`
  app.setGlobalPrefix('api/v1');

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('RustDesk Platform API')
    .setDescription('API de gestão de dispositivos e address book')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  
  // CORS para permitir conexao do client web/desktop
  app.enableCors();
  
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
