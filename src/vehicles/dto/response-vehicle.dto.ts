export class ResponseVehicleDto {
    vehicle_id: number;
    brand: string;
    model: string;
    plate: string;
    year: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(vehicle) {
        this.vehicle_id = vehicle.vehicle_id;
        this.brand = vehicle.brand;
        this.model = vehicle.model;
        this.plate = vehicle.plate;
        this.year = vehicle.year;
        this.createdAt = vehicle.created_at;
        this.updatedAt = vehicle.updated_at;
    }
}