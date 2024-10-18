import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
function parseBoolean(value: any): boolean {
  return value === 'true' || value === '1' || value === true;
}
export class CreateSensorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description : string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  regionId : number;

  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => parseBoolean(value))
  status: boolean;
}