import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MultipleCreateNotifyDto {
  
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readingId: number;

  @IsOptional()
  @IsString()
  message: string;

}