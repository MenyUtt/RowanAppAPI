import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './evidencia.entity';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepo: Repository<Evidencia>,
  ) {}

  findAll(): Promise<Evidencia[]> {
    return this.evidenciaRepo.find({ relations: ['ticket', 'usuario'] });
  }

  findOne(id: number): Promise<Evidencia | null> {
    return this.evidenciaRepo.findOne({ where: { id }, relations: ['ticket', 'usuario'] });
  }

  async create(data: CreateEvidenciaDto): Promise<Evidencia> {
    const evidencia = this.evidenciaRepo.create({
      tipo_archivo: data.tipo_archivo,
      url_archivo: data.url_archivo,
      ticket: { id: data.ticket_id } as any,
      usuario: { id: data.usuario_id } as any,
    });
    return this.evidenciaRepo.save(evidencia);
  }

  async update(id: number, data: UpdateEvidenciaDto): Promise<Evidencia> {
    const evidencia = await this.evidenciaRepo.findOne({ where: { id } });
    if (!evidencia) throw new Error('Evidencia no encontrada');

    if (data.tipo_archivo !== undefined) evidencia.tipo_archivo = data.tipo_archivo;
    if (data.url_archivo !== undefined) evidencia.url_archivo = data.url_archivo;
    if (data.ticket_id) evidencia.ticket = { id: data.ticket_id } as any;
    if (data.usuario_id) evidencia.usuario = { id: data.usuario_id } as any;

    return this.evidenciaRepo.save(evidencia);
  }

  remove(id: number): Promise<any> {
    return this.evidenciaRepo.delete(id);
  }
}
