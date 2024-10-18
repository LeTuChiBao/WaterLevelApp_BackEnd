import { Region } from "@src/regions/region.entity";
import { Role } from "@src/role/role.entity";
import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName : string;

  @IsOptional()
  @IsString()
  lastName : string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  regionId : number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status : number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  roleId: number;
}