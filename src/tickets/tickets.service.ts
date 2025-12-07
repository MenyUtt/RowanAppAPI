import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { AsignacionTicket } from '../asignaciones-tickets/asignacion-ticket.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(AsignacionTicket)
    private asignacionRepository: Repository<AsignacionTicket>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findByEdificio(edificioId: number): Promise<any[]> {
    const tickets = await this.ticketsRepository.find({
      where: { edificio: { id: edificioId } },
      relations: ['tipoSistema', 'cliente'],
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

  // 👇 MODIFICACIÓN: Se quitó la palabra "async" de aquí 👇
  create(ticketData: CreateTicketDto): Promise<Ticket> {
      const ticket = this.ticketsRepository.create({
        ...ticketData,
        tipoSistema: { id: ticketData.tipo_sistema_id },
        edificio: { id: ticketData.edificio_id },
        cliente: { id: ticketData.cliente_id },
      });
      return this.ticketsRepository.save(ticket);
    }

  async update(id: number, updateData: any): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${id} no encontrado`);
    }

    ticket.descripcion = updateData.descripcion;
    // @ts-ignore
    ticket.tipoSistema = { id: updateData.tipo_sistema_id };
    await this.ticketsRepository.save(ticket);

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
    }
    
    const ticketActualizado = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['tipoSistema', 'cliente'],
    });

    if (!ticketActualizado) {
        throw new NotFoundException(`El ticket con ID ${id} no se encontró después de actualizar.`);
    }

    return ticketActualizado;
  }
}