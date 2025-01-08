import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ResponseServiceDto } from './dto/response-service.dto';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ){}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = this.serviceRepository.create(createServiceDto);
      return new ResponseServiceDto(await this.serviceRepository.save(service));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try{
      const data = await this.serviceRepository.find();
      return data.map((service) => new ResponseServiceDto(service));
    }
    catch(error){
      throw new BadRequestException(error);
    }
  }

  async findOne(service_id: number) : Promise<ResponseServiceDto> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { service_id },
      });
      if (!service) {
        throw new BadRequestException('Service not found');
      }
      return new ResponseServiceDto(service);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(service_id: number, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.serviceRepository.update(service_id,{
        name: updateServiceDto.name,
        description: updateServiceDto.description,
        price: updateServiceDto.price,
      });
      return this.findOne(service_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(service_id: number) : Promise<ResponseServiceDto> {
    try {
      const service =  this.findOne(service_id);
      await this.serviceRepository.delete(service_id);
      return service;
    }
    catch(error){
      throw new BadRequestException(error);
    }
  }
}
