import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiProperty({ description: 'ID del rol asignado al usuario', example: 1, required: false })
  @IsOptional()
  rol_id?: number;
}
