import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { ResponseVehicleDto } from './dto/response-vehicle.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VehiclesService {

  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)  // Inyecta el repositorio de User
    private userRepository: Repository<User>,
  ) {}
  
  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> { // Retorna la entidad Vehicle
    try {
      const { user, ...vehicleData } = createVehicleDto; // Destructuring para separar el user
      const vehicle = this.vehicleRepository.create(vehicleData); // Crea el vehículo sin el usuario

      if (user) {
        const foundUser = await this.userRepository.findOne({ where: { user_id: user } });
        if (!foundUser) {
          throw new NotFoundException('Usuario no encontrado');
        }
        vehicle.user = foundUser; // Asigna el usuario encontrado
      }

      const savedVehicle = await this.vehicleRepository.save(vehicle);
      return savedVehicle; // Retorna la entidad guardada
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

async update(vehicle_id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    try {
      const vehicle = await this.vehicleRepository.findOne({ where: { vehicle_id } });
      if (!vehicle) {
        throw new NotFoundException('Vehículo no encontrado');
      }

      // Actualiza los campos básicos del vehículo
      vehicle.brand = updateVehicleDto.brand || vehicle.brand;
      vehicle.model = updateVehicleDto.model || vehicle.model;
      vehicle.plate = updateVehicleDto.plate || vehicle.plate;
      vehicle.year = updateVehicleDto.year || vehicle.year;

      // Maneja la actualización del usuario (igual que en create)
      if (updateVehicleDto.user) {
        const foundUser = await this.userRepository.findOne({ where: { user_id: updateVehicleDto.user } });
        if (!foundUser) {
          throw new NotFoundException('Usuario no encontrado');
        }
        vehicle.user = foundUser;
      } else if (updateVehicleDto.user === null) {  // Para desvincular el vehículo del usuario
        vehicle.user = null;
      }

      const updatedVehicle = await this.vehicleRepository.save(vehicle);
      return updatedVehicle;
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
