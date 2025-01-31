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
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userReporsitory: Repository<User>,
    private readonly cloudinaryService: CloudinaryService, // Inyecta el servicio de Cloudinary
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      if (!Object.values(Roles).includes(createUserDto.rol as Roles)) {
        throw new BadRequestException('Rol no definido');
      }

      let profilePictureUrl: string | undefined;

      // Si se proporciona una foto de perfil, súbela a Cloudinary
      if (createUserDto.profilePicture) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          createUserDto.profilePicture,
        );
        profilePictureUrl = uploadResult.secure_url;
      }

      const user = this.userReporsitory.create({
        name: createUserDto.name,
        password: await bcryptjs.hash(createUserDto.password, 10),
        email: createUserDto.email,
        phone: createUserDto.phone,
        rol: createUserDto.rol,
        profilePicture: profilePictureUrl, // Asigna la URL de la foto de perfil
      });

      return new ResponseUserDto(await this.userReporsitory.save(user));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      const user = await this.userReporsitory.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let profilePictureUrl: string | undefined;

      // Si se proporciona una nueva foto de perfil, súbela a Cloudinary
      if (updateUserDto.profilePicture) {
        const uploadResult = await this.cloudinaryService.uploadImage(
          updateUserDto.profilePicture,
        );
        profilePictureUrl = uploadResult.secure_url;
      }

      // Actualiza los campos del usuario
      user.name = updateUserDto.name || user.name;
      user.password = updateUserDto.password
        ? await bcryptjs.hash(updateUserDto.password, 10)
        : user.password;
      user.email = updateUserDto.email || user.email;
      user.phone = updateUserDto.phone || user.phone;
      user.rol = updateUserDto.rol || user.rol;
      user.profilePicture = profilePictureUrl || user.profilePicture;

      await this.userReporsitory.save(user);
      return new ResponseUserDto(user);
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
