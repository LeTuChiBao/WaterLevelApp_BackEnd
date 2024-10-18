import { IsOptional, IsString } from "class-validator";

export class FilterReadingDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;
  
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  water_level: string;
}