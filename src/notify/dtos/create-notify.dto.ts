import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotifyDto {
  
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readingId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsString()
  message: string;

}