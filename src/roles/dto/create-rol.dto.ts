import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;
}
