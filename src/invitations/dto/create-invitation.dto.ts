import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateInvitationDto {
    @IsString()
    workspaceId: string;

    @IsOptional()
    @IsInt()
    maxUses?: number;

    @IsOptional()
    @IsDateString()
    expiresAt?: Date;

}
