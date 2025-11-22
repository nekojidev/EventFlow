import { OrderStatus } from '@eventflow/common';

export class OrderUpdatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly status: OrderStatus,
    public readonly previousStatus?: OrderStatus,
    public readonly timestamp: Date = new Date(),
  ) {}
}