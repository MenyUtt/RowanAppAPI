import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginStep1Dto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  contrasena: string;

  @ApiProperty({ description: 'Token obtenido de Google reCAPTCHA' })
  @IsString()
  @IsNotEmpty()
  recaptchaToken: string;
}