import { IsOptional, IsString } from "class-validator";

export class FilterNotifyDto {
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
  isReading: string;
}