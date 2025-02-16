import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Service, Product])],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
