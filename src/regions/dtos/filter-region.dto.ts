import { IsOptional, IsString } from "class-validator";

export class FilterRegionDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;
  
  @IsOptional()
  @IsString()
  search: string;
}