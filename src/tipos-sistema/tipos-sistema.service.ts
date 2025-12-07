import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSistema } from './tipo-sistema.entity';
import { CreateTipoSistemaDto } from './dto/create-tipo-sistema.dto';
import { UpdateTipoSistemaDto } from './dto/update-tipo-sistema.dto';

@Injectable()
export class TiposSistemaService {
  constructor(
    @InjectRepository(TipoSistema)
    private readonly tipoSistemaRepo: Repository<TipoSistema>,
  ) {}

  findAll(): Promise<TipoSistema[]> {
    return this.tipoSistemaRepo.find({ relations: ['tickets'] });
  }

  async findOne(id: number): Promise<TipoSistema> {
    const tipo = await this.tipoSistemaRepo.findOne({ where: { id }, relations: ['tickets'] });
    if (!tipo) throw new NotFoundException('Tipo de sistema no encontrado');
    return tipo;
  }

  async create(createDto: CreateTipoSistemaDto): Promise<TipoSistema> {
    const tipo = this.tipoSistemaRepo.create(createDto);
    return this.tipoSistemaRepo.save(tipo);
  }

  async update(id: number, updateDto: UpdateTipoSistemaDto): Promise<TipoSistema> {
    const tipo = await this.findOne(id);
    Object.assign(tipo, updateDto);
    return this.tipoSistemaRepo.save(tipo);
  }

  async remove(id: number): Promise<void> {
    const tipo = await this.findOne(id);
    await this.tipoSistemaRepo.remove(tipo);
  }
}
