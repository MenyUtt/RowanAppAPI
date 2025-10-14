import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHistorialStatusDto {
  @ApiProperty({ example: 1, description: 'ID del ticket relacionado' })
  @IsNumber()
  @IsNotEmpty()
  ticket_id: number;

  @ApiProperty({ example: 'pendiente', enum: ['pendiente', 'revision', 'finalizado'], description: 'Status anterior del ticket' })
  @IsEnum(['pendiente', 'revision', 'finalizado'])
  @IsOptional()
  status_anterior?: string;

  @ApiProperty({ example: 'revision', enum: ['pendiente', 'revision', 'finalizado'], description: 'Nuevo status del ticket' })
  @IsEnum(['pendiente', 'revision', 'finalizado'])
  @IsNotEmpty()
  status_nuevo: string;

  @ApiProperty({ example: 2, description: 'ID del usuario que realizó el cambio' })
  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;
}
