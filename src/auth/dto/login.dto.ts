// auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  contrasena: string;
}
