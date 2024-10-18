import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateReadingDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  sensorId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  water_level : number;
}