import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionTicket } from './asignacion-ticket.entity';

@Injectable()
export class AsignacionesTicketsService {
  constructor(
    @InjectRepository(AsignacionTicket)
    private readonly asignacionRepo: Repository<AsignacionTicket>,
  ) {}

  findAll(): Promise<AsignacionTicket[]> {
    return this.asignacionRepo.find({ relations: ['ticket', 'empleado', 'jefe'] });
  }

  findOne(id: number): Promise<AsignacionTicket | null> {
    return this.asignacionRepo.findOne({ where: { id }, relations: ['ticket', 'empleado', 'jefe'] });
  }

  create(data: Partial<AsignacionTicket>): Promise<AsignacionTicket> {
    const asignacion = this.asignacionRepo.create(data);
    return this.asignacionRepo.save(asignacion);
  }

  update(id: number, data: Partial<AsignacionTicket>): Promise<any> {
    return this.asignacionRepo.update(id, data);
  }

  remove(id: number): Promise<any> {
    return this.asignacionRepo.delete(id);
  }

    async assign(ticketId: number, empleadoId: number): Promise<AsignacionTicket> {
    // Try to find existing assignment for the ticket
    const existing = await this.asignacionRepo.findOne({ where: { ticket: { id: ticketId } }, relations: ['ticket', 'empleado', 'jefe'] });
    if (existing) {
      // update empleado relation (partial object with id is OK)
      existing.empleado = { id: empleadoId } as any;
      return this.asignacionRepo.save(existing);
    }

    // create new assignment
    const newAsign = this.asignacionRepo.create({ ticket: { id: ticketId } as any, empleado: { id: empleadoId } as any });
    return this.asignacionRepo.save(newAsign);
  }
}
