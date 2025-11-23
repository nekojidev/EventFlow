export const config = {
  app: {
    name: process.env.ORDER_SERVICE_NAME || "order-service",
    port: parseInt(process.env.ORDER_SERVICE_PORT || '3001', 10),
    environment: process.env.NODE_ENV || 'development'
  },
  database: {
    host: process.env.ORDER_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.ORDER_DATABASE_PORT || '5432', 10),
    username: process.env.ORDER_DATABASE_USER || 'order_user',
    password: process.env.ORDER_DATABASE_PASSWORD || 'order_pass',
    name: process.env.ORDER_DATABASE_NAME || 'order_db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },
  rabbitmq: {
    url: process.env.ORDER_RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672',
    queue: 'order.queue',
  }
}