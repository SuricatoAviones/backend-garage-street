import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { Multer } from 'multer'; // Importa Multer para manejar archivos
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME, // Reemplaza con tu cloud_name
      api_key: process.env.API_KEY, // Reemplaza con tu api_key
      api_secret: process.env.API_SECRET, // Reemplaza con tu api_secret
    });
  }

  async uploadImage(file: Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}