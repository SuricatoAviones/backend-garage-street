import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Request, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Request as ExpressRequest } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('imagenes'))
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @UploadedFiles(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
      ],
    }))
    files: Multer.File[],
    @Request() req: ExpressRequest,
  ) {
    const jsonData = JSON.parse(req.headers['x-json-payload'] as string);

    const paymentData = { ...createPaymentDto, ...jsonData };

    return this.paymentsService.create(paymentData, files);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}