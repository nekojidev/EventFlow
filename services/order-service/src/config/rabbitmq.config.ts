import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import { config } from './app.config';

export const rabbitmqConfig: MicroserviceOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [config.rabbitmq.url],
    queue: config.rabbitmq.queue,
    queueOptions: {
      durable: true,
    }
  }
}