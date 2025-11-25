import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto, OrderDto } from '@eventflow/common';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() CreateOrderDto: CreateOrderDto) : Promise<OrderDto> {
    return await this.orderService.create(CreateOrderDto)
  }

  @Get('id')
  async findById(@Param('id') id: string) : Promise<OrderDto> {
    return await this.orderService.findById(id)
  } 

  @Get('user/:userId')
  async findByUserId(@Param('userid') userId : string) : Promise<OrderDto[]>{
    return await this.orderService.findByUserId(userId)
  }

//Todo put delete

}