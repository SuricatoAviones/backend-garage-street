export class ResponseBudgetDto {
    id: number;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, name: string, status: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}