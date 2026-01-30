import { IsString, MinLength } from 'class-validator';

export class JoinWorkspaceDto {
  @IsString()
  @MinLength(6)
  code: string;
}