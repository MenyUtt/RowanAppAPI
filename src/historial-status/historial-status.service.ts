import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialStatus } from './historial-status.entity';
import { CreateHistorialStatusDto } from './dto/create-historial-status.dto';
import { UpdateHistorialStatusDto } from './dto/update-historial-status.dto';
import { Ticket } from 'src/tickets/ticket.entity';
import { Usuario } from 'src/usuarios/usuario.entity';

@Injectable()
export class HistorialStatusService {
  constructor(
    @InjectRepository(HistorialStatus)
    private readonly historialRepo: Repository<HistorialStatus>,
  ) {}

  findAll(): Promise<HistorialStatus[]> {
    return this.historialRepo.find({ relations: ['ticket', 'usuario'] });
  }

  findOne(id: number): Promise<HistorialStatus | null> {
    return this.historialRepo.findOne({ where: { id }, relations: ['ticket', 'usuario'] });
  }

  async create(dto: CreateHistorialStatusDto): Promise<HistorialStatus> {
    const historial = this.historialRepo.create({
      status_anterior: dto.status_anterior,
      status_nuevo: dto.status_nuevo,
      ticket: { id: dto.ticket_id } as Ticket,
      usuario: { id: dto.usuario_id } as Usuario,
    });
    return this.historialRepo.save(historial);
  }

  async update(id: number, dto: UpdateHistorialStatusDto): Promise<any> {
    const historial = {
      ...(dto.status_anterior && { status_anterior: dto.status_anterior }),
      ...(dto.status_nuevo && { status_nuevo: dto.status_nuevo }),
      ...(dto.ticket_id && { ticket: { id: dto.ticket_id } as Ticket }),
      ...(dto.usuario_id && { usuario: { id: dto.usuario_id } as Usuario }),
    };
    return this.historialRepo.update(id, historial);
  }

  remove(id: number): Promise<any> {
    return this.historialRepo.delete(id);
  }
}
