import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/modules/auth/auth.module';
import { UsersModule } from './app/modules/users/users.module';
import { ProductsModule } from './app/modules/products/products.module';
import { SalesModule } from './app/modules/sales/sales.module';
import { PrismaModule } from './app/shared/prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, SalesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
