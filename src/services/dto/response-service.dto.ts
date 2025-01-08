export class ResponseServiceDto {
    service_id: number;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(service) {
        this.service_id = service.service_id;
        this.name = service.name;
        this.description = service.description;
        this.price = service.price;
        this.createdAt = service.created_at;
        this.updatedAt = service.updated_at;
    }
}