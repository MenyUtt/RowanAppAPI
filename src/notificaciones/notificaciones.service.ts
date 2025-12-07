import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { Usuario } from 'src/usuarios/usuario.entity';
import { Ticket } from 'src/tickets/ticket.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
  ) {}

  findAll(): Promise<Notificacion[]> {
    return this.notificacionRepo.find({ relations: ['usuario', 'ticket'] });
  }

  findOne(id: number): Promise<Notificacion | null> {
    return this.notificacionRepo.findOne({ where: { id }, relations: ['usuario', 'ticket'] });
  }

  async create(dto: CreateNotificacionDto): Promise<Notificacion> {
    const notificacion = this.notificacionRepo.create({
      tipo: dto.tipo,
      mensaje: dto.mensaje,
      leida: dto.leida ?? false,
      usuario: { id: dto.usuarioId } as Usuario,
      ticket: { id: dto.ticketId } as Ticket,
    });
    return this.notificacionRepo.save(notificacion);
  }

  async update(id: number, dto: UpdateNotificacionDto): Promise<any> {
    const notificacion = {
      ...(dto.tipo && { tipo: dto.tipo }),
      ...(dto.mensaje && { mensaje: dto.mensaje }),
      ...(dto.leida !== undefined && { leida: dto.leida }),
      ...(dto.usuarioId && { usuario: { id: dto.usuarioId } as Usuario }),
      ...(dto.ticketId && { ticket: { id: dto.ticketId } as Ticket }),
    };
    return this.notificacionRepo.update(id, notificacion);
  }

  remove(id: number): Promise<any> {
    return this.notificacionRepo.delete(id);
  }
}
