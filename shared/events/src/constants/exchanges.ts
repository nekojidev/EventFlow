export const Exchanges = {
  ORDER_EXCHANGE : 'order.exchange',
  PAYMENT_EXCHANGE : 'payment.exchange',
  INVENTORY_EXCHANGE : 'inventory.exchange',
  NOTIFICATION_EXCHANGE : 'notification.exchange',
} as const;

export type ExchangeName = typeof Exchanges[keyof typeof Exchanges];