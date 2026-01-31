import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role_User } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary TODO: MEJORAR para producción
cloudinary.config({
  cloud_name: 'dk5b2zjck',
  api_key: '646853788926753',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret-here',
});

@Auth(Role_User.USER)
@ApiTags('Upload')
@Controller('upload')
export class WorkspaceUploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG, PNG, and SVG are allowed.',
      );
    }

    // Validar tamaño (1MB máximo)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 1MB limit.');
    }

    try {
      // Subir a Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'jiro_workspaces',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      });

      return {
        success: true,
        url: (result as any).secure_url,
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }
}
