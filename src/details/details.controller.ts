import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DetailsService } from './details.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';

@ApiTags('Details')
@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() createDetailDto: CreateDetailDto,
    @UploadedFile() img: Multer.File,
  ) {
    return this.detailsService.create(createDetailDto, img);
  }

  @Get()
  findAll() {
    return this.detailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailsService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() updateDetailDto: UpdateDetailDto,
    @UploadedFile() img: Multer.File,
  ) {
    return this.detailsService.update(+id, updateDetailDto, img);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailsService.remove(+id);
  }
}