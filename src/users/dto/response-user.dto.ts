import { User } from "../entities/user.entity";

export class ResponseUserDto {
    user_id: number;
    name: string;
    password: string;
    email: string;
    rol: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: User) {
        this.user_id = user.user_id;
        this.name = user.name;
        this.password = user.password;
        this.email = user.email;
        this.rol = user.rol;
        this.createdAt = user.created_at;
        this.updatedAt = user.updated_at;
    }
}