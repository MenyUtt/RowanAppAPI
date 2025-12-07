import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'TCK-001', description: 'Código único del ticket' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo_ticket: string;

  @ApiProperty({ example: 1, description: 'ID del tipo de sistema' })
  @IsInt()
  @IsNotEmpty()
  tipo_sistema_id: number;

  @ApiProperty({ example: 2, description: 'ID del edificio relacionado' })
  @IsInt()
  @IsNotEmpty()
  edificio_id: number;

  @ApiProperty({ example: 5, description: 'ID del cliente (usuario que creó el ticket)' })
  @IsInt()
  @IsNotEmpty()
  cliente_id: number;

  @ApiProperty({ example: 'El sistema eléctrico está fallando', description: 'Descripción del problema' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({ 
    example: 'pendiente', 
    description: 'Estado actual del ticket', 
    enum: ['pendiente', 'revision', 'finalizado'],
    default: 'pendiente'
  })
  @IsEnum(['pendiente', 'revision', 'finalizado'])
  status?: string;
}
