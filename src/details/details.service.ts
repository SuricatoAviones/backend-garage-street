import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detail } from './entities/detail.entity';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { ResponseDetailDto } from './dto/response-detail.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { Multer } from 'multer';
@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private detailRepository: Repository<Detail>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createDetailDto: CreateDetailDto, img: Multer.File): Promise<ResponseDetailDto> {
    try {
      let imgUrl: string | undefined;

      if (img) {
        const uploadResult = await this.cloudinaryService.uploadImage(img);
        imgUrl = uploadResult.secure_url;
      }

      const detail = this.detailRepository.create({
        ...createDetailDto,
        img: imgUrl,
      });

      const savedDetail = await this.detailRepository.save(detail);
      return new ResponseDetailDto(savedDetail);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<ResponseDetailDto[]> {
    try {
      const details = await this.detailRepository.find();
      return details.map((detail) => new ResponseDetailDto(detail));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(detail_id: number): Promise<ResponseDetailDto> {
    try {
      const detail = await this.detailRepository.findOne({
        where: { detail_id },
      });
      if (!detail) {
        throw new NotFoundException('Detail not found');
      }
      return new ResponseDetailDto(detail);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    detail_id: number,
    updateDetailDto: UpdateDetailDto,
    img: Multer.File,
  ): Promise<ResponseDetailDto> {
    try {
      const detail = await this.detailRepository.findOne({
        where: { detail_id },
      });
      if (!detail) {
        throw new NotFoundException('Detail not found');
      }

      if (img) {
        const uploadResult = await this.cloudinaryService.uploadImage(img);
        detail.img = uploadResult.secure_url;
      }

      detail.text = updateDetailDto.text || detail.text;

      const updatedDetail = await this.detailRepository.save(detail);
      return new ResponseDetailDto(updatedDetail);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(detail_id: number): Promise<ResponseDetailDto> {
    try {
      const detail = await this.findOne(detail_id);
      await this.detailRepository.delete(detail_id);
      return detail;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}