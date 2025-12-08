import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { AsignacionTicket } from '../asignaciones-tickets/asignacion-ticket.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
// Importamos los servicios necesarios
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(AsignacionTicket)
    private asignacionRepository: Repository<AsignacionTicket>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    // Inyectamos servicios
    @Inject(forwardRef(() => NotificacionesService))
    private notificacionesService: NotificacionesService,
    private usuariosService: UsuariosService,
    private firebaseService: FirebaseService,
  ) {}

  async findByEdificio(edificioId: number): Promise<any[]> {
    // ... (Tu código existente se queda igual) ...
    const tickets = await this.ticketsRepository.find({
      where: { edificio: { id: edificioId } },
      relations: ['tipoSistema', 'cliente', 'evidencias'],
      order: { fecha_creacion: 'DESC' },
    });
    const ticketsConAsignacion = await Promise.all(
      tickets.map(async (ticket) => {
        const ultimaAsignacion = await this.asignacionRepository.findOne({
          where: { ticket: { id: ticket.id } },
          relations: ['empleado'],
          order: { fecha_asignacion: 'DESC' },
        });
        return {
          ...ticket,
          usuarioAsignado: ultimaAsignacion ? ultimaAsignacion.empleado : null,
        };
      }),
    );

    return ticketsConAsignacion;
  }

  // === CREAR TICKET (Notificar a Staff) ===
  async create(ticketData: CreateTicketDto): Promise<Ticket> {
      const ticket = this.ticketsRepository.create({
        ...ticketData,
        tipoSistema: { id: ticketData.tipo_sistema_id },
        edificio: { id: ticketData.edificio_id },
        cliente: { id: ticketData.cliente_id },
      });
      const savedTicket = await this.ticketsRepository.save(ticket);

      // --- NOTIFICACIÓN PUSH A COORDINADORES Y ADMIN ---
      const staff = await this.usuariosService.findStaff();
      
      for (const admin of staff) {
        await this.notificacionesService.create({
          usuarioId: admin.id,
          ticketId: savedTicket.id,
          tipo: 'nuevo_ticket',
          mensaje: `Nuevo ticket #${savedTicket.codigo_ticket || savedTicket.id} creado.`,
        });
        if (admin.fcm_token) {
          await this.firebaseService.sendPushNotification(
            admin.fcm_token,
            'Nuevo Ticket Creado',
            `Se ha creado el ticket #${savedTicket.id} en ${savedTicket.edificio?.nombre || 'un edificio'}.`,
            { ticketId: savedTicket.id, type: 'nuevo_ticket' }
          );
        }
      }
      return savedTicket;
  }

  // === ACTUALIZAR TICKET (Notificar a Staff y Técnico) ===
  async update(id: number, updateData: any): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    // 1. Actualizar datos
    ticket.descripcion = updateData.descripcion;
    if (updateData.status) {
      ticket.status = updateData.status;
    }
    // @ts-ignore
    ticket.tipoSistema = { id: updateData.tipo_sistema_id };
    
    await this.ticketsRepository.save(ticket);

    // --- NOTIFICACIÓN PUSH A COORDINADORES Y ADMIN (Modificación) ---
    const staff = await this.usuariosService.findStaff();
    for (const admin of staff) {
      // Evitamos notificar al mismo usuario que está haciendo el cambio si es staff (opcional)
      // if (admin.id === updateData.usuario_modificador_id) continue; 
      const mensaje = `El ticket #${ticket.id} ha sido actualizado a: ${ticket.status}.`;

      await this.notificacionesService.create({
        usuarioId: admin.id,
        ticketId: ticket.id,
        tipo: updateData.status ? 'cambio_status' : 'ticket_actualizado',
        mensaje: `El ticket #${ticket.id} ha sido actualizado.`,
      });

      if (admin.fcm_token) {
        await this.firebaseService.sendPushNotification(
          admin.fcm_token,
          'Ticket Actualizado',
          mensaje,
          { ticketId: ticket.id, type: 'ticket_actualizado' }
        );
      }
    }
    // -------------------------------------------------------------

    // 2. Asignación de Técnico
    if (updateData.asignado_id) {
      const tecnico = await this.usuarioRepository.findOne({ where: { id: updateData.asignado_id } });
      if (!tecnico) {
        throw new NotFoundException('Técnico no encontrado');
      }
      
      const nuevaAsignacion = this.asignacionRepository.create({
        ticket: { id: ticket.id },
        empleado: { id: tecnico.id },
      });
      await this.asignacionRepository.save(nuevaAsignacion);

      const mensajeTecnico = `Se te ha asignado el ticket #${ticket.id}.`;
      // --- NOTIFICACIÓN PUSH AL TÉCNICO (Solo al asignado) ---
      await this.notificacionesService.create({
        usuarioId: tecnico.id,
        ticketId: ticket.id,
        tipo: 'asignacion',
        mensaje: mensajeTecnico,
      });
      if (tecnico.fcm_token) {
        await this.firebaseService.sendPushNotification(
          tecnico.fcm_token,
          'Nueva Asignación',
          mensajeTecnico,
          { ticketId: ticket.id, type: 'asignacion' }
        );
      }
      // -------------------------------------------------------
    } 

    const ticketActualizado = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['tipoSistema', 'cliente'],
    });

    if (!ticketActualizado) throw new NotFoundException('Error al recuperar ticket');
    
    return ticketActualizado;
  }
  async remove(id: number): Promise<void> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }
    // Opcional: Si tienes relaciones "cascade" no necesitas borrar manual, 
    // pero por seguridad a veces se borran primero las asignaciones.
    // Por ahora usaremos el delete directo:
    await this.ticketsRepository.delete(id);
  }
}