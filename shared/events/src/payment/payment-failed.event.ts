import { PaymentStatus } from '@eventflow/common';

export class PaymentFailedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly failureReason: string,
    public readonly status: PaymentStatus,
    public readonly timestamp: Date = new Date(),
  ) {}
}
