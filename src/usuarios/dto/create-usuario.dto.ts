import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, Length, IsBoolean, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez Gómez' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  apellidos: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: '5551234567', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  telefono?: string;

  @ApiProperty({ description: 'Correo del usuario', example: 'juan@example.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'secret123' })
  @IsString()
  @Length(6, 255)
  contrasena: string;

  @ApiProperty({ description: 'ID del rol asignado al usuario', example: 1 })
  @IsInt()
  rol_id: number;

  @ApiProperty({ description: 'Si el usuario está activo', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
