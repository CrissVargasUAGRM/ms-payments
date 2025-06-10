import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreatePaymentDto {

    @IsNumber()
    @IsPositive()
    clientId: number;

    @IsNumber()
    @IsPositive()
    userId: number;

    @IsString()
    @IsUUID()
    orderId: string;

    @IsNumber()
    @IsPositive()
    amount: number;

}
