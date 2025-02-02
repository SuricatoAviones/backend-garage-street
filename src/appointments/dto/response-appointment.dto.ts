import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";
import { Service } from "src/services/entities/service.entity";
import { Product } from "src/products/entities/product.entity";

export class ResponseAppointmentDto {
    appointment_id: number;
    date: Date;
    observations: string;
    status: string;
    typeService: string;
    homeService: boolean;
    user: User;
    vehicle: Vehicle;
    services: Service[];
    products: Product[];
    createdAt: Date;
    updatedAt: Date;

    constructor(appointment) {
        this.appointment_id = appointment.appointment_id;
        this.date = appointment.date;
        this.observations = appointment.observations;
        this.typeService = appointment.typeService;
        this.homeService = appointment.homeService;
        this.status = appointment.status;
        this.user = appointment.user_id ? appointment.user_id : null;
        this.vehicle = appointment.vehicle_id ? appointment.vehicle_id : null;
        this.products = appointment.products_id ? appointment.products_id : [];
        this.services = appointment.services_id ? appointment.services_id : [];
        this.createdAt = appointment.created_at;
        this.updatedAt = appointment.updated_at;
    }
}