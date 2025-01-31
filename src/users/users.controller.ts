import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'; // Importa Multer para manejar archivos
@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiConsumes('multipart/form-data') // Indica que el endpoint consume form-data
  @UseInterceptors(FileInterceptor('profilePicture')) // 'profilePicture' es el nombre del campo en el formulario
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() profilePicture: Multer.File,
  ) {
    // Asigna el archivo subido al DTO
    createUserDto.profilePicture = profilePicture;
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data') // Indica que el endpoint consume form-data
  @UseInterceptors(FileInterceptor('profilePicture')) // 'profilePicture' es el nombre del campo en el formulario
  update(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profilePicture: Multer.File,
  ) {
    // Asigna el archivo subido al DTO
    updateUserDto.profilePicture = profilePicture;
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
