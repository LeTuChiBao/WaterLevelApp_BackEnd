import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class FilterReadingSensorDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sensorId: number;

}