import { NestFactory } from '@nestjs/core';
import { TradingAgentsModule } from './trading-agents.module.js';

async function bootstrap() {
  const app = await NestFactory.create(TradingAgentsModule);
  await app.listen(process.env.port ?? 3000);
}
await bootstrap();
