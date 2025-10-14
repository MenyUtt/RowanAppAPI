import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificacionDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que recibirá la notificación' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ example: 1, description: 'ID del ticket relacionado' })
  @IsNumber()
  @IsNotEmpty()
  ticketId: number;

  @ApiProperty({
    example: 'nuevo_ticket',
    enum: ['nuevo_ticket','ticket_actualizado','asignacion','cambio_status'],
    description: 'Tipo de notificación'
  })
  @IsEnum(['nuevo_ticket','ticket_actualizado','asignacion','cambio_status'])
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: 'Se ha creado un nuevo ticket', description: 'Mensaje de la notificación' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiProperty({ example: false, description: 'Indica si la notificación ha sido leída', required: false })
  @IsBoolean()
  @IsOptional()
  leida?: boolean;
}
