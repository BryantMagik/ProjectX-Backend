import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './CreateProject.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
