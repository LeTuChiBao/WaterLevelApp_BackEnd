import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateReadingDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sensorId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  water_level : number;
}