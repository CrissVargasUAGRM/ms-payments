import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger('PaymentsService');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ){
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PaymentsService connected to the database');
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      // 1.- Validar que el UUID de la orden exista
      /*const order = await firstValueFrom(
        this.client.send('findOneOrder', createPaymentDto.orderId)
      );*/

      // 2.- Crear el pago en la base de datos
      const payment = await this.payment.create({
        data: {
          clientid: createPaymentDto.clientId,
          userid: createPaymentDto.userId,
          orderId: createPaymentDto.orderId,
          amount: createPaymentDto.amount,
          createdAt: new Date(),
        }
      });

      // cambiar de estado la orden de 'PENDING' a 'PAYED'
      const changeStatus = await firstValueFrom(
        this.client.send('changeOrderStatus', {id: createPaymentDto.orderId, status: 'PAYED'}),
      );
      console.log(changeStatus)
      return 'This action adds a new payment';
    } catch (error) {
      console.log(error)
      this.logger.error('Error creating payment', error);
      throw error; // Re-throw the error to be handled by the controller
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
