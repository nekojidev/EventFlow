import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";
import { OrderStatus } from "@eventflow/common";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async create(order: Partial<OrderEntity>) : Promise<OrderEntity> {
    const newOrder = this.repository.create(order)
    return await this.repository.save(newOrder)
  }

  async findById(id: string) : Promise<OrderEntity | null>{
  return await this.repository.findOne({ where: { id}})
}

 async findByUserId(userId: string) : Promise<OrderEntity[]> {
  return await this.repository.find({ where: { userId}})
 }
 async updateStatus(
  id: string,
  status: OrderStatus,
): Promise<OrderEntity | null> {
  await this.repository.update(id, { status });
  return await this.findById(id);
}

async update(id: string, data: Partial<OrderEntity>): Promise<OrderEntity | null> {
  await this.repository.update(id, data);
  return await this.findById(id);
}

async delete(id: string): Promise<void> {
  await this.repository.delete(id);
}
}