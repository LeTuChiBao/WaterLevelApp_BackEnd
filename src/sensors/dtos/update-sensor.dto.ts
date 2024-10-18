import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
function parseBoolean(value: any): boolean {
  return value === 'true' || value === '1' || value === true;
}

export class UpdateSensorDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description : string;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  latitude: number;

  @IsOptional()
  @IsNumber()
  @Transform(({value}) => parseFloat(value))
  longitude: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => parseBoolean(value))
  status: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  regionId : number;
}