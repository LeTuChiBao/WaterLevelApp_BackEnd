import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRegionDto {

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  damage_level: number;
}