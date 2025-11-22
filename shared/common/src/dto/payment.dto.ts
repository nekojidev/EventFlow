import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { PaymentStatus } from '../enums';

export class CreatePaymentDto {
  @IsString()
  orderId!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  paymentMethod!: string; // 'CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', etc.

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}

export class PaymentDto {
  id!: string;
  orderId!: string;
  amount!: number;
  paymentMethod!: string;
  status!: PaymentStatus;
  transactionId?: string;
  failureReason?: string;
  createdAt!: Date;
  updatedAt!: Date;
}