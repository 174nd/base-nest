
import { ClientProviderOptions, RmqOptions, Transport } from '@nestjs/microservices';
import { MicroserviceHealthIndicatorOptions } from '@nestjs/terminus';

export declare type rabbitmqOptions = {
  name: string;
  queue?: string;
};

export function rabbitmqOptions(queue?: string): MicroserviceHealthIndicatorOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASS || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}`],
      queue: queue || process.env.RABBITMQ_QUEUE || undefined,
      queueOptions: {
        durable: process.env.RABBITMQ_DURABLE === 'true' || false
      }
    }
  };
}

// options: ClientsModuleOptions
export function rabbitmq(options: rabbitmqOptions): ClientProviderOptions {
  return {
    name: options.name,
    ...rabbitmqOptions(options.queue)
  };
}