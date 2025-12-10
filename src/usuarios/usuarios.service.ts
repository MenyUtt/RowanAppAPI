import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  findAll(): Promise<Usuario[]> {
    // 👇 MODIFICACIÓN: Añadir relations
    return this.usuariosRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    // 👇 MODIFICACIÓN: Añadir relations
    const usuario = await this.usuariosRepository.findOne({ 
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async create(data: any): Promise<Usuario> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.contrasena, salt);

    // Mapeamos manualmente el rol_id que viene del front a la relación 'rol'
    const nuevoUsuario = this.usuariosRepository.create({
      nombre: data.nombre,
      apellidos: data.apellidos,
      correo: data.correo,
      telefono: data.telefono,
      contrasena: hash,
      // Si viene rol_id úsalo, si no, pon el 5 por defecto como seguridad
      rol: { id: data.rol_id || 5 } 
    });

    return this.usuariosRepository.save(nuevoUsuario);
  }

  async update(id: number, usuario: Partial<Usuario> | any): Promise<Usuario> {
    // Handle rol_id coming from client (e.g. { rol_id: 3 }) which is not a direct property
    // of the Usuario entity. Map it to the relation 'rol' and use save() to persist relations.
    const { rol_id, ...rest } = usuario || {};

    const existing = await this.usuariosRepository.findOne({ where: { id }, relations: ['rol'] });
    if (!existing) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Apply scalar updates
    if (rest && Object.keys(rest).length) {
      Object.assign(existing, rest);
    }

    // If rol_id provided, set the relation properly
    if (rol_id !== undefined && rol_id !== null) {
      // assign minimal object so TypeORM updates relation (assumes rol entity exists)
      (existing as any).rol = { id: Number(rol_id) } as any;
    }

    await this.usuariosRepository.save(existing);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usuariosRepository.delete(id);
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    // 👇 MODIFICACIÓN: Añadir relations
    return this.usuariosRepository.findOne({ 
      where: { correo },
      relations: ['rol'], 
    });
  }

  async findTecnicos(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: {
        rol: {
          nombre: 'Tecnico',
        },
      },
      relations: ['rol'],
    });
  }
  async findStaff(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      where: [
        { rol: { nombre: 'Administracion' } }, // Asegúrate que el nombre en BD sea exacto
        { rol: { nombre: 'Coordinador' } }
      ],
      relations: ['rol'],
    });
  }
}