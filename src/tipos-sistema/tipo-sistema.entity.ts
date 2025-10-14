import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tipos_sistema')
export class TipoSistema {
  @ApiProperty({ example: 1, description: 'ID del tipo de sistema' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Red de Datos', description: 'Nombre del tipo de sistema' })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ example: 'Sistema relacionado con infraestructura de red', description: 'Descripción del tipo de sistema', required: false })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ type: () => [Ticket], description: 'Tickets asociados a este tipo de sistema', required: false })
  @OneToMany(() => Ticket, ticket => ticket.tipoSistema)
  tickets: Ticket[];
}
