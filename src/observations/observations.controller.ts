import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ObservationsService } from './observations.service';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';

@ApiTags('Observations')
@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('img'))
  create(
    @Body() createObservationDto: CreateObservationDto,
    @UploadedFiles() imgs: Multer.File[],
  ) {
    return this.observationsService.create(createObservationDto, imgs);
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
  @UseInterceptors(FilesInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() updateObservationDto: UpdateObservationDto,
    @UploadedFiles() imgs: Multer.File[],
  ) {
    return this.observationsService.update(+id, updateObservationDto, imgs);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.observationsService.remove(+id);
  }
}