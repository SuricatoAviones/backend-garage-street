export class ResponsePaymentMethodDto {
    payment_method_id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(paymentMethod) {
      this.payment_method_id = paymentMethod.payment_method_id;
      this.name = paymentMethod.name;
      this.description = paymentMethod.description;
      this.createdAt = paymentMethod.created_at;
      this.updatedAt = paymentMethod.updated_at;
    }
  }