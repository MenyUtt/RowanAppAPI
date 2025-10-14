import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edificio } from './edificio.entity';
import { CreateEdificioDto } from './dto/create-edificio.dto';
import { UpdateEdificioDto } from './dto/update-edificio.dto';

@Injectable()
export class EdificiosService {
  constructor(
    @InjectRepository(Edificio)
    private readonly edificioRepo: Repository<Edificio>,
  ) {}

  findAll(): Promise<Edificio[]> {
    return this.edificioRepo.find();
  }

  async findOne(id: number): Promise<Edificio> {
    const edificio = await this.edificioRepo.findOne({ where: { id } });
    if (!edificio) throw new NotFoundException('Edificio no encontrado');
    return edificio;
  }

  async create(createDto: CreateEdificioDto): Promise<Edificio> {
    const edificio = this.edificioRepo.create(createDto);
    return this.edificioRepo.save(edificio);
  }

  async update(id: number, updateDto: UpdateEdificioDto): Promise<Edificio> {
    const edificio = await this.findOne(id);
    Object.assign(edificio, updateDto);
    return this.edificioRepo.save(edificio);
  }

  async remove(id: number): Promise<void> {
    const edificio = await this.findOne(id);
    await this.edificioRepo.remove(edificio);
  }
}
