import { Module } from '@nestjs/common';
import { CreditService } from './credit.service.js';
import { CreditController } from './credit.controller.js';

@Module({
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
