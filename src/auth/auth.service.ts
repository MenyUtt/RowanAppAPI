import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contraseña: string) {
    const user = await this.usuariosService.findByEmail(correo);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(contraseña, user.contrasena);
    if (!isPasswordValid) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      correo: user.correo,
      rol: user.rol.nombre,
      nombre: user.nombre,
      apellidos: user.apellidos,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id: user.id,
        correo: user.correo,
        rol: user.rol.nombre,
        nombre: user.nombre,
        apellidos: user.apellidos,
      },
    };
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const salt = Number(process.env.BCRYPT_SALT) || 10;
    return bcrypt.hash(plainPassword, salt);
  }
}

