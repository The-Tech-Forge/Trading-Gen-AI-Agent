import { Injectable } from '@nestjs/common';

@Injectable()
export class TradingAgentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
