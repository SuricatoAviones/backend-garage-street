import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { Roles } from './enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userReporsitory: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      if (!Object.values(Roles).includes(createUserDto.rol as Roles)) {
        throw new BadRequestException('Rol no definido');
      }
      const user = this.userReporsitory.create({
        name: createUserDto.name,
        password: await bcryptjs.hash(createUserDto.password, 10),
        email: createUserDto.email,
        phone: createUserDto.phone,
        rol: createUserDto.rol,
      });
      return new ResponseUserDto(await this.userReporsitory.save(user));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return this.userReporsitory.findOneBy({ email });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByUser(name: string) {
    try {
      return this.userReporsitory.findOneBy({ name });
    } catch (error) {}
  }

  async findAll(): Promise<Array<ResponseUserDto>> {
    try {
      const data = await this.userReporsitory.find();
      return data.map((user) => new ResponseUserDto(user));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(user_id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.userReporsitory.findOne({
        where: {
          user_id,
        },
      });
      if (!user) throw new NotFoundException();
      return new ResponseUserDto(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(user_id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    try {
      const user = await this.userReporsitory.update(user_id, {
        name: updateUserDto.name,
        password: updateUserDto.password,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        rol: updateUserDto.rol,
      })
      return this.findOne(user_id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(user_id: number) : Promise<ResponseUserDto> {
    try {
      const user = this.findOne(user_id);
      await this.userReporsitory.delete(user_id);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
