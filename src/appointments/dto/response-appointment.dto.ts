import { Product } from "src/products/entities/product.entity";
import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Vehicle } from "src/vehicles/entities/vehicle.entity";

export class ResponseAppointmentDto {
    appointment_id: number;
    observations: string;
    status: string;
    user_id: User;
    vehicle_id: Vehicle;
    services_id: Service[];
    products_id: Product[];
    createdAt: Date;
    updatedAt: Date;
    constructor(appointment) {
        this.appointment_id = appointment.appointment_id;
        this.observations = appointment.observations;
        this.status = appointment.status;
        this.user_id = appointment.user_id;
        this.vehicle_id = appointment.vehicle_id;
        this.services_id = appointment.services_id;
        this.createdAt = appointment.created_at;
        this.updatedAt = appointment.updated_at;
    }
}