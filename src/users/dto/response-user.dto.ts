import { User } from '../entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

export class ResponseUserDto {
  user_id: number;
  name: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  dni: string;
  rol: string;
  profilePicture: string;
  vehicle: Vehicle;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.user_id = user.user_id;
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.dni = user.dni;
    this.rol = user.rol;
    this.profilePicture = user.profilePicture;
    this.vehicle = user.vehicles ? user.vehicles[0] : null; // Asume que solo hay un vehículo por usuario
    this.createdAt = user.created_at;
    this.updatedAt = user.updated_at;
  }
}