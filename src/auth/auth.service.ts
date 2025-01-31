import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { EmailService } from './email.service'; // Importa el servicio de correo

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService, // Inyecta el servicio de correo
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Contraseña Incorrecta');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña Incorrecta');
    }

    const payload = { id: user.user_id, name: user.name, email: user.email, rol: user.rol };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      payload,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { email: user.email, sub: user.user_id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = await bcryptjs.hash(newPassword, 10);
      await this.usersService.update(user.user_id, { password: user.password });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}