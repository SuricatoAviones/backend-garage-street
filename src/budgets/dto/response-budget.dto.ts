export class ResponseBudgetDto {
    id: number;
    name: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, name: string, amount: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}