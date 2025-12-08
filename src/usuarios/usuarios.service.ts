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

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    await this.usuariosRepository.update(id, usuario);
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