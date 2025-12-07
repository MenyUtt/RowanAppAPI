import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateEdificioDto {
  @ApiProperty({ example: 'Edificio Central', description: 'Nombre del edificio' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', description: 'Dirección del edificio' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  direccion: string;
}
