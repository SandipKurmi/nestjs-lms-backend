import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  //   level
  @IsNotEmpty()
  @IsString()
  level: string;

  // price
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
