// auth/dto/me.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class MeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  correo: string;

  @ApiProperty()
  rol: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  apellidos: string;
}
