import { IsOptional, IsString } from "class-validator";

export class FilterUserDto{
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;
  
  @IsOptional()
  @IsString()
  search: string
}