import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { ResponseVehicleDto } from './dto/response-vehicle.dto';

@Injectable()
export class VehiclesService {

  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}
  
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      return new ResponseVehicleDto(await this.vehicleRepository.save(vehicle));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try{
      const data = await this.vehicleRepository.find();
      return data.map((vehicle) => new ResponseVehicleDto(vehicle));
    }
    catch(error){
      throw new BadRequestException(error);
    }

  }

  async findOne(vehicle_id: number) : Promise<ResponseVehicleDto> {
    try {
      const vehicle = await this.vehicleRepository.findOne({
        where: { vehicle_id },
      });
      if (!vehicle) {
        throw new BadRequestException('Vehicle not found');
      }
      return new ResponseVehicleDto(vehicle);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(vehicle_id: number, updateVehicleDto: UpdateVehicleDto) {
    try {
      const vehicle = await this.vehicleRepository.update(vehicle_id,{
        brand: updateVehicleDto.brand,
        model: updateVehicleDto.model,
        plate: updateVehicleDto.plate,
        year: updateVehicleDto.year,
      });
      return this.findOne(vehicle_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(vehicle_id: number) : Promise<ResponseVehicleDto> {
    try {
      const vehicle =  this.findOne(vehicle_id);
      await this.vehicleRepository.delete(vehicle_id);
      return vehicle;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
