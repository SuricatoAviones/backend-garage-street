import { User } from "../entities/user.entity";

export class ResponseUserDto {
    user_id: number;
    name: string;
    password: string;
    email: string;
    phone: string
    rol: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: User) {
        this.user_id = user.user_id;
        this.name = user.name;
        this.password = user.password;
        this.email = user.email;
        this.phone = user.phone;
        this.rol = user.rol;
        this.profilePicture = user.profilePicture;
        this.createdAt = user.created_at;
        this.updatedAt = user.updated_at;
    }
}