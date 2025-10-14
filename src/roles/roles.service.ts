import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  findAll(): Promise<Rol[]> {
    return this.rolRepo.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepo.findOne({ where: { id } });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepo.create(createRolDto);
    return this.rolRepo.save(rol);
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRolDto);
    return this.rolRepo.save(rol);
  }

  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolRepo.remove(rol);
  }
}
