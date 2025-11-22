import { PaymentStatus } from '@eventflow/common';

export class PaymentRefundedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly refundAmount: number,
    public readonly refundReason: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
