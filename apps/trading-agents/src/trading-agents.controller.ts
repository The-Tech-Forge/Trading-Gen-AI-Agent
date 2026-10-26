import { Controller, Get } from '@nestjs/common';
import { TradingAgentsService } from './trading-agents.service.js';

@Controller()
export class TradingAgentsController {
  constructor(private readonly tradingAgentsService: TradingAgentsService) {}

  @Get()
  getHello(): string {
    return this.tradingAgentsService.getHello();
  }
}
