import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateEvidenciaDto {
  @ApiProperty({ example: 1, description: 'ID del ticket al que pertenece la evidencia' })
  @IsInt()
  @IsNotEmpty()
  ticket_id: number;

  @ApiProperty({ example: 2, description: 'ID del usuario que sube la evidencia' })
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @ApiProperty({ enum: ['pdf', 'imagen'], example: 'imagen', description: 'Tipo de archivo de la evidencia' })
  @IsEnum(['pdf', 'imagen'])
  tipo_archivo: string;

  @ApiProperty({ example: 'https://misitio.com/uploads/evidencia.png', description: 'URL del archivo subido' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url_archivo: string;
}
