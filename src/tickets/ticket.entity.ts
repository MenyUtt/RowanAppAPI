import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuarios/usuario.entity';
import { Edificio } from 'src/edificios/edificio.entity';
import { TipoSistema } from 'src/tipos-sistema/tipo-sistema.entity';
import { AsignacionTicket } from 'src/asignaciones-tickets/asignacion-ticket.entity';
import { Evidencia } from 'src/evidencias/evidencia.entity';
import { HistorialStatus } from 'src/historial-status/historial-status.entity';
import { Notificacion } from 'src/notificaciones/notificacion.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  codigo_ticket: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'enum', enum: ['pendiente', 'revision', 'finalizado'], default: 'pendiente' })
  status: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_actualizacion: Date;

  @ManyToOne(() => TipoSistema, tipo => tipo.tickets, { eager: true })
  @JoinColumn({ name: 'tipo_sistema_id' })
  tipoSistema: TipoSistema;

  @ManyToOne(() => Edificio, edificio => edificio.tickets, { eager: true })
  @JoinColumn({ name: 'edificio_id' })
  edificio: Edificio;

  @ManyToOne(() => Usuario, usuario => usuario.ticketsCliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  @OneToMany(() => AsignacionTicket, asignacion => asignacion.ticket)
  asignaciones: AsignacionTicket[];

  @OneToMany(() => Evidencia, evidencia => evidencia.ticket)
  evidencias: Evidencia[];

  @OneToMany(() => HistorialStatus, historial => historial.ticket)
  historialStatus: HistorialStatus[];

  @OneToMany(() => Notificacion, notificacion => notificacion.ticket)
  notificaciones: Notificacion[];
}
