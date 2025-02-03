import { User } from 'src/users/entities/user.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Service } from 'src/services/entities/service.entity';
import { Product } from 'src/products/entities/product.entity';
import { Detail } from 'src/details/entities/detail.entity'; // Importamos Detail
import { Observation } from 'src/observations/entities/observation.entity'; // Importamos Observation

export class ResponseAppointmentDto {
  appointment_id: number;
  date: Date;
  status: string;
  typeService: string;
  homeService: boolean;
  user: User;
  vehicle: Vehicle;
  services: Service[];
  products: Product[];
  details: Detail[]; // Agregamos detalles
  observations: Observation[]; // Agregamos observaciones
  createdAt: Date;
  updatedAt: Date;

  constructor(appointment) {
    this.appointment_id = appointment.appointment_id;
    this.date = appointment.date;
    this.status = appointment.status;
    this.typeService = appointment.typeService;
    this.homeService = appointment.homeService;
    this.user = appointment.user_id ? appointment.user_id : null;
    this.vehicle = appointment.vehicle_id ? appointment.vehicle_id : null;
    this.services = appointment.services_id ? appointment.services_id : [];
    this.products = appointment.products_id ? appointment.products_id : [];
    this.details = appointment.details ? appointment.details : []; // Mapeamos detalles
    this.observations = appointment.observations ? appointment.observations : []; // Mapeamos observaciones
    this.createdAt = appointment.created_at;
    this.updatedAt = appointment.updated_at;
  }
}