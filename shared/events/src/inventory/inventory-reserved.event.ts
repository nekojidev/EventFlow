export class InventoryReservedEvent {
  constructor(
    public readonly productId: string,
    public readonly orderId: string,
    public readonly quantity: number,
    public readonly reservedQuantity: number,
    public readonly availableQuantity: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}