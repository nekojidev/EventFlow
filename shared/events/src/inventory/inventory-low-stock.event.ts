export class InventoryLowStockEvent {
  constructor(
    public readonly productId: string,
    public readonly currentQuantity: number,
    public readonly threshold: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}
