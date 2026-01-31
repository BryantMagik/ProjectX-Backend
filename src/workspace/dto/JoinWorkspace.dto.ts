import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinWorkspaceDto {
  @ApiProperty({
    description: 'Invitation token to join the workspace',
    example: 'clx1y2z3a0000abc123def456',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
