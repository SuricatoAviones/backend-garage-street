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
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
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

      const user = this.userRepository.create({
        name: createUserDto.name,
        password: await bcryptjs.hash(createUserDto.password, 10),
        email: createUserDto.email,
        phone: createUserDto.phone,
        rol: createUserDto.rol,
        profilePicture: profilePictureUrl, // Asigna la URL de la foto de perfil
      });

      const savedUser = await this.userRepository.save(user);

      // Si se proporciona un vehículo, guárdalo y asígnalo al usuario
      if (createUserDto.vehicle) {
        const vehicle = this.vehicleRepository.create({
          ...createUserDto.vehicle,
          user_id: savedUser,
        });
        await this.vehicleRepository.save(vehicle);
      }

      return new ResponseUserDto(savedUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      const user = await this.userRepository.findOne({
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

      const updatedUser = await this.userRepository.save(user);

      /* // Si se proporciona un vehículo, actualízalo o créalo
      if (updateUserDto.vehicle) {
        let vehicle = await this.vehicleRepository.findOne({
          where: { user_id: userId },
        });

        if (vehicle) {
          vehicle = Object.assign(vehicle, updateUserDto.vehicle);
        } else {
          vehicle = this.vehicleRepository.create({
            ...updateUserDto.vehicle,
            user_id: updatedUser,
          });
        }

        await this.vehicleRepository.save(vehicle);
      } */

      return new ResponseUserDto(updatedUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneByUser(name: string) {
    try {
      return this.userRepository.findOneBy({ name });
    } catch (error) {}
  }

  async findAll(): Promise<Array<ResponseUserDto>> {
    try {
      const data = await this.userRepository.find({ relations: ['vehicles'] });
      return data.map((user) => new ResponseUserDto(user));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(user_id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id },
        relations: ['vehicles'],
      });
      if (!user) throw new NotFoundException();
      return new ResponseUserDto(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(user_id: number): Promise<ResponseUserDto> {
    try {
      const user = await this.findOne(user_id);
      await this.userRepository.delete(user_id);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}