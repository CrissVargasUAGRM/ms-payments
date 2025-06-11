import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('createPayment')
  async createPaymentSession(@Payload() payment: any) {
    return await this.paymentsService.create(payment);;
  }

  /*@MessagePattern('getPayments')
  async success() {
    return await this.paymentsService.findAll();
  }*/

  @MessagePattern('cancelPayment')
  cancel() {
    return 'payment cancel';
  }

}
