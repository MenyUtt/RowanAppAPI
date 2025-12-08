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

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    const salt = await bcrypt.genSalt(10);
    if (!usuario.contrasena) {
      throw new Error('La contraseña es obligatoria');
    }
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
    const usuarioConRol = {
      ...usuario,
      rol: { id: 5 } as any 
    };

    const newUser = this.usuariosRepository.create(usuario);
    return this.usuariosRepository.save(newUser);
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
}