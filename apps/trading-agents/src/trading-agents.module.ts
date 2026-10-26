import { Module } from '@nestjs/common';
import { TradingAgentsController } from './trading-agents.controller.js';
import { TradingAgentsService } from './trading-agents.service.js';

@Module({
  imports: [],
  controllers: [TradingAgentsController],
  providers: [TradingAgentsService],
})
export class TradingAgentsModule {}
