import { where } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const transaction = await OrderModel.sequelize.transaction();

    try {

      const actualItems = await OrderItemModel.findAll({ where: { order_id: entity.id }, transaction });

      await OrderModel.update(
        {
          custumer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
          transaction
        }
      );

      for (const item of entity.items) {

        const found = actualItems.find(i => i.id === item.id);

        if (found) {
          await OrderItemModel.update(
            {
              name: item.name,
              price: item.price,
              product_id: item.productId,
              quantity: item.quantity,
            },
            {
              where: { id: item.id, order_id: entity.id },
              transaction
            }
          );
        } else {
          await OrderItemModel.create(
            {
              id: item.id,
              name: item.name,
              price: item.price,
              product_id: item.productId,
              quantity: item.quantity,
              order_id: entity.id
            },
            {
              transaction
            }
          );
        }

      }

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne(
      {
        where: { id: id },
        include: ["items"]
      }
    );

    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(item =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity)
      )
    );

  }

  async findAll(): Promise<Order[]> {

    const orederModels = await OrderModel.findAll({ include: ["items"] });

    return orederModels
      .map(order => new Order(
        order.id,
        order.customer_id,
        order.items
          .map(item =>
            new OrderItem(
              item.id,
              item.name,
              item.price,
              item.product_id,
              item.quantity)
          )
      ));

  }


}
