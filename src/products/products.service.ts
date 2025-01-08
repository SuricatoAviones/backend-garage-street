import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ResponseProductDto } from './dto/response-product.dto';

@Injectable()
export class ProductsService {
  
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return new ResponseProductDto(await this.productRepository.save(product));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const data = await this.productRepository.find();
      return data.map((product) => new ResponseProductDto(product));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(product_id: number) : Promise<ResponseProductDto> {
    try {
      const product = await this.productRepository.findOne({
        where: { product_id },
      });
      if (!product) {
        throw new BadRequestException('Product not found');
      }
      return new ResponseProductDto(product);
    } catch (error) {
      throw new BadRequestException(error);
    }  
  }

  async update(product_id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.update(product_id,{
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
      });
      return this.findOne(product_id);
    } catch (error) {
      throw new BadRequestException(error);
    }  
  }

  async remove(product_id: number) : Promise<ResponseProductDto> {
    try {
      const product = this.findOne(product_id);
      await this.productRepository.delete(product_id);
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
