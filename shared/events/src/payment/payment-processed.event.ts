import { PaymentStatus } from "@eventflow/common";

export class PaymentProcessedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly transactionId: string,
    public readonly status: PaymentStatus,
    public readonly timestamp: Date = new Date(),
  ){}
}