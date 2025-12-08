import { IsString, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class Activate2faDto {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsNumberString()
  @Length(6, 6)
  token: string;
}