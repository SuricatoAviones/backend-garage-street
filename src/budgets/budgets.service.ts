import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const { services_id, products_id, ...budgetData } = createBudgetDto;
    const budget = this.budgetRepository.create(budgetData);

    if (services_id && Array.isArray(services_id)) {
      const processedServices: Service[] = [];
      for (const serviceDto of services_id) {
        // Si se envía solo el id
        if (serviceDto.service_id) {
          const existingService = await this.serviceRepository.findOne({
            where: { service_id: serviceDto.service_id },
          });
          if (!existingService) {
            throw new NotFoundException(`Service with ID ${serviceDto.service_id} not found`);
          }
          processedServices.push(existingService);
        } else {
          // Crear un nuevo servicio con los datos proporcionados
          const newService = this.serviceRepository.create(serviceDto);
          const savedService = await this.serviceRepository.save(newService);
          processedServices.push(savedService);
        }
      }
      budget.services_id = processedServices;
    }

    if (products_id && Array.isArray(products_id)) {
      const processedProducts: Product[] = [];
      for (const productDto of products_id) {
        // Si se envía solo el id
        if (productDto.product_id) {
          const existingProduct = await this.productRepository.findOne({
            where: { product_id: productDto.product_id },
          });
          if (!existingProduct) {
            throw new NotFoundException(`Product with ID ${productDto.product_id} not found`);
          }
          processedProducts.push(existingProduct);
        } else {
          // Crear un nuevo producto con los datos proporcionados
          const newProduct = this.productRepository.create(productDto);
          const savedProduct = await this.productRepository.save(newProduct);
          processedProducts.push(savedProduct);
        }
      }
      budget.products_id = processedProducts;
    }

    return await this.budgetRepository.save(budget);
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id);
    const { services_id, products_id, ...updateData } = updateBudgetDto;
    Object.assign(budget, updateData);

    if (services_id && Array.isArray(services_id)) {
      const processedServices: Service[] = [];
      for (const serviceDto of services_id) {
        if (serviceDto.service_id) {
          const existingService = await this.serviceRepository.findOne({
            where: { service_id: serviceDto.service_id },
          });
          if (!existingService) {
            throw new NotFoundException(`Service with ID ${serviceDto.service_id} not found`);
          }
          processedServices.push(existingService);
        } else {
          const newService = this.serviceRepository.create(serviceDto);
          const savedService = await this.serviceRepository.save(newService);
          processedServices.push(savedService);
        }
      }
      budget.services_id = processedServices;
    }

    if (products_id && Array.isArray(products_id)) {
      const processedProducts: Product[] = [];
      for (const productDto of products_id) {
        if (productDto.product_id) {
          const existingProduct = await this.productRepository.findOne({
            where: { product_id: productDto.product_id },
          });
          if (!existingProduct) {
            throw new NotFoundException(`Product with ID ${productDto.product_id} not found`);
          }
          processedProducts.push(existingProduct);
        } else {
          const newProduct = this.productRepository.create(productDto);
          const savedProduct = await this.productRepository.save(newProduct);
          processedProducts.push(savedProduct);
        }
      }
      budget.products_id = processedProducts;
    }

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

  async remove(id: number): Promise<Budget> {
    const budget = await this.findOne(id);
    await this.budgetRepository.delete(id);
    return budget;
  }
}