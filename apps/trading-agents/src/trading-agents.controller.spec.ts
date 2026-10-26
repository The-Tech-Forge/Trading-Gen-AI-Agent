import { Test, TestingModule } from '@nestjs/testing';
import { TradingAgentsController } from './trading-agents.controller.js';
import { TradingAgentsService } from './trading-agents.service.js';

describe('TradingAgentsController', () => {
  let tradingAgentsController: TradingAgentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TradingAgentsController],
      providers: [TradingAgentsService],
    }).compile();

    tradingAgentsController = app.get<TradingAgentsController>(TradingAgentsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tradingAgentsController.getHello()).toBe('Hello World!');
    });
  });
});
