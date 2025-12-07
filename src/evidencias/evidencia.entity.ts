import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { Usuario } from 'src/usuarios/usuario.entity';

@Entity('evidencias')
export class Evidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['pdf', 'imagen'] })
  tipo_archivo: string;

  @Column({ length: 255 })
  url_archivo: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_subida: Date;

  @ManyToOne(() => Ticket, ticket => ticket.evidencias)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => Usuario, usuario => usuario.evidencias)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
