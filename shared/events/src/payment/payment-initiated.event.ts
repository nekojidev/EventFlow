import { PaymentStatus } from '@eventflow/common';

export class PaymentInitiatedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly paymentMethod: string,
    public readonly status: PaymentStatus,
    public readonly timestamp: Date = new Date(),
  ) {}
}
