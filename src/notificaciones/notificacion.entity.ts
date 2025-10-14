import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { Ticket } from 'src/tickets/ticket.entity';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['nuevo_ticket','ticket_actualizado','asignacion','cambio_status'] })
  tipo: string;

  @Column({ length: 255 })
  mensaje: string;

  @Column({ default: false })
  leida: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;

  @ManyToOne(() => Usuario, usuario => usuario.notificaciones)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Ticket, ticket => ticket.notificaciones)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
