
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class RegisterUserDto {
  
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
}