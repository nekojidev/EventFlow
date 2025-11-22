import { InventoryStatus } from '@eventflow/common';

export class InventoryUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly reservedQuantity: number,
    public readonly availableQuantity: number,
    public readonly status: InventoryStatus,
    public readonly timestamp: Date = new Date(),
  ) {}
}
