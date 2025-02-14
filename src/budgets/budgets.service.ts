import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const budget = this.budgetRepository.create(createBudgetDto);
    return await this.budgetRepository.save(budget);
  }

  async findAll(): Promise<Budget[]> {
    return await this.budgetRepository.find({
      relations: ['services_id', 'products_id'],
    });
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { budget_id: id },
      relations: ['services_id', 'products_id'],
    });
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    return budget;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id);
    const updatedBudget = Object.assign(budget, updateBudgetDto);
    return await this.budgetRepository.save(updatedBudget);
  }

  async remove(id: number): Promise<Budget> {
    const budget = await this.findOne(id);
    await this.budgetRepository.delete(id);
    return budget;
  }
}