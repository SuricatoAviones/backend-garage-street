export class ResponseProductDto{
    product_id: number;
    name: string;
    description: string;
    price: number;
    code: string;
    stock: number;
    brand: string;
    model: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(product){
        this.product_id = product.product_id;
        this.name = product.name;
        this.model = product.model;
        this.brand = product.brand;
        this.code = product.code;
        this.stock = product.stock;
        this.description = product.description;
        this.price = product.price;
        this.createdAt = product.created_at;
        this.updatedAt = product.updated_at;
    }
}