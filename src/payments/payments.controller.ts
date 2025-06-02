import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession() {
    return 'createPaymentSession';
  }

  @Get('success')
  success() {
    return 'payment success';
  }

  @Get('cancel')
  cancel() {
    return 'payment cancel';
  }

  @Post('webhook')
  async methodToPayment() {
    return 'method to payment';
  }

}
