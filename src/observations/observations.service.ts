import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observation } from './entities/observation.entity';
import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { ResponseObservationDto } from './dto/response-observation.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { Multer } from 'multer';
@Injectable()
export class ObservationsService {
  constructor(
    @InjectRepository(Observation)
    private observationRepository: Repository<Observation>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createObservationDto: CreateObservationDto, img: Multer.File): Promise<ResponseObservationDto> {
    try {
      let imgUrl: string | undefined;

      if (img) {
        const uploadResult = await this.cloudinaryService.uploadImage(img);
        imgUrl = uploadResult.secure_url;
      }

      const observation = this.observationRepository.create({
        ...createObservationDto,
        img: imgUrl,
      });

      const savedObservation = await this.observationRepository.save(observation);
      return new ResponseObservationDto(savedObservation);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<ResponseObservationDto[]> {
    try {
      const observations = await this.observationRepository.find();
      return observations.map((observation) => new ResponseObservationDto(observation));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(observation_id: number): Promise<ResponseObservationDto> {
    try {
      const observation = await this.observationRepository.findOne({
        where: { observation_id },
      });
      if (!observation) {
        throw new NotFoundException('Observation not found');
      }
      return new ResponseObservationDto(observation);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    observation_id: number,
    updateObservationDto: UpdateObservationDto,
    img: Multer.File,
  ): Promise<ResponseObservationDto> {
    try {
      const observation = await this.observationRepository.findOne({
        where: { observation_id },
      });
      if (!observation) {
        throw new NotFoundException('Observation not found');
      }

      if (img) {
        const uploadResult = await this.cloudinaryService.uploadImage(img);
        observation.img = uploadResult.secure_url;
      }

      observation.text = updateObservationDto.text || observation.text;

      const updatedObservation = await this.observationRepository.save(observation);
      return new ResponseObservationDto(updatedObservation);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(observation_id: number): Promise<ResponseObservationDto> {
    try {
      const observation = await this.findOne(observation_id);
      await this.observationRepository.delete(observation_id);
      return observation;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}