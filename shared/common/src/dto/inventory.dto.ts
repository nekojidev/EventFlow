import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { InventoryStatus } from '../enums';

export class ReserveInventoryDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  orderId!: string;
}

export class ReleaseInventoryDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  orderId!: string;
}

export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;
}

export class InventoryDto {
  id!: string;
  productId!: string;
  quantity!: number;
  reservedQuantity!: number;
  availableQuantity!: number;
  status!: InventoryStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
