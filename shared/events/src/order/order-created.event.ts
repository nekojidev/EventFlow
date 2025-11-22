import {OrderDto, OrderStatus} from '@eventflow/common';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: Array<{
      productId: string,
      quantity: number,
      price: number,
    }>,
    public readonly totalAmount: number,
    public readonly status: OrderStatus,
    public readonly timestamp: Date = new Date(),
  ){
    
  }
}