import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto, UpdateOrderDto, OrderDto, OrderStatus } from "@eventflow/common";
import { OrderEntity } from "./order.entity";
import { OrderEventPublisher } from "../events/publishers/order.event.publisher";

@Injectable()
export class OrderService {
constructor(
 private readonly orderRepository: OrderRepository,
 private readonly eventPublisher: OrderEventPublisher,
){}

async create(createOrderDto: CreateOrderDto) : Promise<OrderDto> {
  const totalAmount = createOrderDto.items.reduce((sum, item) => sum + item.price  * item.quantity, 0)

const order = await this.orderRepository.create({
   ...createOrderDto,
   totalAmount,
   status: OrderStatus.PENDING,
})

//Publish OrderCreatedEvent
await this.eventPublisher.publishOrderCreated(order)

return this.toDto(order)
}

async findById(id: string) : Promise<OrderDto> {
  const order = await this.orderRepository.findById(id)
  if(!order) {
    throw new NotFoundException(`Order with id ${id} not found`)
  }

  return this.toDto(order)
}

async findByUserId(userId : string) : Promise<OrderDto[]> {
  const orders = await this.orderRepository.findByUserId(userId)
  return orders.map((order) => this.toDto(order))
}

async update(id: string, updateOrderDto: UpdateOrderDto) : Promise<OrderDto>{
  const existingOrder = await this.orderRepository.findById(id);

  if(!existingOrder) {
    throw new NotFoundException(`Order with id ${id} not found`)
  }

  const previousStatus = existingOrder.status;
  const order = await this.orderRepository.update(id,  updateOrderDto )

  // Publish OrderUpdatedEvent if status changed

  if(updateOrderDto.status && updateOrderDto.status !== previousStatus) {
    await this.eventPublisher.publishOrderStatusChanged(order.id, previousStatus)
  }

  return this.toDto(order)

}
async cancel(id: string, userId: string) :  Promise<OrderDto> {
  const order = await this.orderRepository.findById(id)

  if(!order) {
    throw new NotFoundException(`Order with id ${id} not found`)
  }

  if(order.userId !== userId) {
    throw new NotFoundException(`Order with id ${id} not found`)
 }

 const updatedOrder = await this.orderRepository.updateStatus(
  id,
  OrderStatus.CANCELLED
 )

 //publish OrderCancelledEvent
 await this.eventPublisher.publishOrderCancelled(updatedOrder!, userId)
 
 return this.toDto(updatedOrder!)
}

 private toDto(entity: OrderEntity): OrderDto {
  return {
    id: entity.id,
    userId: entity.userId,
    items: entity.items,
    status: entity.status,
    totalAmount: entity.totalAmount,
    shippingAddress: entity.shippingAddress,
    notes: entity.notes,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  }
 }

}