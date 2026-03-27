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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Auth(Role_User.USER)
@ApiTags('Upload')
@Controller('upload')
export class WorkspaceUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

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

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG, PNG, and SVG are allowed.',
      );
    }

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 1MB limit.');
    }

    try {
      const result = await this.cloudinaryService.uploadBuffer(
        file.buffer,
        'jiro_workspaces',
      );
      return { success: true, url: result.secure_url };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', JSON.stringify(error));
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }
}

