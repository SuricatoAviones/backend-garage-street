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
    user_id: number;
    vehicle_id: number;
    services_id: number[];
    products_id: number[];
    createdAt: Date;
    updatedAt: Date;

    constructor(appointment) {
        this.appointment_id = appointment.appointment_id;
        this.date = appointment.date;
        this.observations = appointment.observations;
        this.typeService = appointment.typeService;
        this.homeService = appointment.homeService;
        this.status = appointment.status;
        this.user_id = appointment.user_id ? appointment.user_id.user_id : null;
        this.vehicle_id = appointment.vehicle_id ? appointment.vehicle_id.vehicle_id : null;
        this.products_id = appointment.products_id ? appointment.products_id.map(product => product.product_id) : [];
        this.services_id = appointment.services_id ? appointment.services_id.map(service => service.service_id) : [];
        this.createdAt = appointment.created_at;
        this.updatedAt = appointment.updated_at;
    }
}