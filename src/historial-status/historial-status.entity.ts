import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { Usuario } from 'src/usuarios/usuario.entity';

@Entity('historial_status')
export class HistorialStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['pendiente', 'revision', 'finalizado'], nullable: true })
  status_anterior: string;

  @Column({ type: 'enum', enum: ['pendiente', 'revision', 'finalizado'], nullable: true })
  status_nuevo: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_cambio: Date;

  @ManyToOne(() => Ticket, ticket => ticket.historialStatus)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => Usuario, usuario => usuario.historialStatus)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
