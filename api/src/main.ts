import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Requisito: Base URL `https://api.empresa.com/api/v1`
  app.setGlobalPrefix('api/v1');
  
  // CORS para permitir conexao do client web/desktop
  app.enableCors();
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
