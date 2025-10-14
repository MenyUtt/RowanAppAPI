import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { Usuario } from 'src/usuarios/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('asignaciones_tickets')
export class AsignacionTicket {
  @ApiProperty({ example: 1, description: 'ID de la asignación' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Ticket, description: 'Ticket asignado' })
  @ManyToOne(() => Ticket, ticket => ticket.asignaciones, { eager: true })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ApiProperty({ type: () => Usuario, description: 'Empleado asignado' })
  @ManyToOne(() => Usuario, usuario => usuario.asignacionesEmpleado, { eager: true })
  empleado: Usuario;

  @ApiProperty({ type: () => Usuario, description: 'Jefe responsable' })
  @ManyToOne(() => Usuario, usuario => usuario.asignacionesJefe, { eager: true })
  jefe: Usuario;

  @ApiProperty({ example: '2025-09-15T14:42:00', description: 'Fecha de asignación' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_asignacion: Date;
}
