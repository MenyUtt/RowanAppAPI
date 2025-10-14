import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  findAll(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      relations: ['tipoSistema', 'edificio', 'cliente'],
    });
  }

  findOne(id: number): Promise<Ticket | null> {
    return this.ticketRepo.findOne({
      where: { id },
      relations: ['tipoSistema', 'edificio', 'cliente'],
    });
  }

  create(ticketData: CreateTicketDto): Promise<Ticket> {
    const ticket = this.ticketRepo.create({
      ...ticketData,
      tipoSistema: { id: ticketData.tipo_sistema_id },
      edificio: { id: ticketData.edificio_id },
      cliente: { id: ticketData.cliente_id },
    });
    return this.ticketRepo.save(ticket);
  }

  async update(id: number, ticketData: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({ where: { id } });
    if (!ticket) throw new Error('Ticket no encontrado');

    if (ticketData.codigo_ticket !== undefined)
      ticket.codigo_ticket = ticketData.codigo_ticket;
    if (ticketData.descripcion !== undefined)
      ticket.descripcion = ticketData.descripcion;
    if (ticketData.status !== undefined) ticket.status = ticketData.status;

    if (ticketData.tipo_sistema_id) {
      ticket.tipoSistema = { id: ticketData.tipo_sistema_id } as any;
    }
    if (ticketData.edificio_id) {
      ticket.edificio = { id: ticketData.edificio_id } as any;
    }
    if (ticketData.cliente_id) {
      ticket.cliente = { id: ticketData.cliente_id } as any;
    }

    return this.ticketRepo.save(ticket);
  }

  remove(id: number): Promise<any> {
    return this.ticketRepo.delete(id);
  }
}
