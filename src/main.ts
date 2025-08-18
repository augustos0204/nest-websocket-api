import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir ferramentas externas
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Usar porta do ambiente ou padrão 3000
  if (!process.env.PORT) console.log('PORT não definida, usando padrão 3000');
  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`🚀 Aplicação rodando na porta ${port}`);
  console.log(`📱 Interface de teste: http://localhost:${port}/tests/rooms`);
  console.log(
    `🔌 WebSocket namespace: ${process.env.WEBSOCKET_NAMESPACE || '/room'}`,
  );
}
bootstrap();
