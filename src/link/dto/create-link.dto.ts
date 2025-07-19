
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  longUrl: string;

  @IsOptional()
  @IsString()
  customAlias?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
