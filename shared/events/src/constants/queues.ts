export const Queues = {
  ORDER_QUEUE: 'order.queue',
  ORDER_EVENTS: 'order.events',
  PAYMENT_QUEUE: 'payment.queue',
  PAYMENT_EVENTS: 'payment.events',
  INVENTORY_QUEUE: 'inventory.queue',
  INVENTORY_EVENTS: 'inventory.events',
  NOTIFICATION_QUEUE: 'notification.queue',
} as const;

export type QueueName = (typeof Queues)[keyof typeof Queues];
