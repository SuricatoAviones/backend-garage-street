import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}
    async login({ email, password }: LoginDto){
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
        throw new UnauthorizedException('Contraseña Incorrecta');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña Incorrecta');
        }

        const payload = { id: user.user_id,name: user.name ,email: user.email, rol: user.rol };
        const token = await this.jwtService.signAsync(payload);

        return {
        token,
        payload
        };
    }
}
