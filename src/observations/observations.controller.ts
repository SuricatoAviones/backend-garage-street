import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';

@ApiTags('Observations')
@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() createObservationDto: CreateObservationDto,
    @UploadedFile() img: Multer.File,
  ) {
    return this.observationsService.create(createObservationDto, img);
  }

  @Get()
  findAll() {
    return this.observationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.observationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() updateObservationDto: UpdateObservationDto,
    @UploadedFile() img: Multer.File,
  ) {
    return this.observationsService.update(+id, updateObservationDto, img);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.observationsService.remove(+id);
  }
}