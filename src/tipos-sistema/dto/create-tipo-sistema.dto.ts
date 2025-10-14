import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class CreateTipoSistemaDto {
  @ApiProperty({ example: 'Red de Datos', description: 'Nombre del tipo de sistema' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({ example: 'Sistema relacionado con la infraestructura de red.', description: 'Descripción del tipo de sistema', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
