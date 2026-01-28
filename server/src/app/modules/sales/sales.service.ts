
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { items: { productId: string; quantity: number }[] }) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const saleItemsData: Prisma.SaleItemUncheckedCreateWithoutSaleInput[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: product.stockQuantity - item.quantity },
        });

        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create Sale
      return tx.sale.create({
        data: {
          userId,
          total,
          items: {
            create: saleItemsData,
          },
        },
        include: { items: true },
      });
    });
  }

  findAll() {
    return this.prisma.sale.findMany({ include: { items: true, user: true } });
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({ where: { id }, include: { items: true, user: true } });
  }
}
