import { Region } from '@src/regions/region.entity';
import { Role } from './../../role/role.entity';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  firstName : string;

  @IsNotEmpty()
  @IsString()
  lastName : string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  regionId : number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  roleId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status : number;
}