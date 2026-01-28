import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @ValidateIf((o) => !o.issueId)
  @IsString()
  taskId?: string;

  @ValidateIf((o) => !o.taskId)
  @IsString()
  issueId?: string;
}
