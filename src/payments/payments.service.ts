import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger('PaymentsService');

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('PaymentsService connected to the database');
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      // 1.- Validar que el UUID de la orden exista
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id: createPaymentDto.orderId }),
      );

      console.log(order);

      // cambiar de estado la orden de 'PENDING' a 'PAID'
      this.order.update({
        where: { id: createPaymentDto.orderId },
        data: { status: 'PAID' },
      });

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

      // llamar a modificar la cantidad de productos
      // obtener los productos de la orden
      const productsId = order.OrderItem.map((orderItem) => ({
        id: orderItem.productId,
        quantity: orderItem.quantity
      }));

      try {
          const updates = productsId.map(productId =>
          firstValueFrom(
            this.client.send({ cmd: 'update-quantity-products' }, productId)
          ));
          await Promise.all(updates);
      } catch (error) {
        console.log(error)
      }

      return payment;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        status: error.status,
        message: error.message,
      });
    }
  }

  /*async findAll() {
  
    return {
      data: await this.payment.findMany({}),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }*/
}
