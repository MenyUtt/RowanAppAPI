import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioTotp } from 'src/usuarios/usuario-totp.entity';

@Injectable()
export class TotpService {
  constructor(
    private usuariosService: UsuariosService,
    @InjectRepository(UsuarioTotp)
    private totpRepo: Repository<UsuarioTotp>,
  ) {}

  async generateSecret(userId: number) {
    const secret = speakeasy.generateSecret({ length: 20 });

    // Guardar o actualizar el secreto en la tabla usuarios_totp
    try {
      let existing = await this.totpRepo.findOne({ where: { usuario: { id: userId } } as any });
      if (existing) {
        existing.secret = secret.base32;
        await this.totpRepo.save(existing);
      } else {
        await this.totpRepo.save({ usuario: { id: userId } as any, secret: secret.base32 });
      }
    } catch (err) {
      throw new InternalServerErrorException('No se pudo almacenar el secreto TOTP');
    }

    const otpauth = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `RowanApp (${userId})`,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
      encoding: 'base32',
    });

    const qr = await qrcode.toDataURL(otpauth);
    return { secret: secret.base32, otpauth, qr };
  }

  async verifyToken(userId: number, token: string) {
    const entry = await this.totpRepo.findOne({ where: { usuario: { id: userId } } as any });
    if (!entry || !entry.secret) throw new BadRequestException('TOTP no configurado');

    return speakeasy.totp.verify({ secret: entry.secret, encoding: 'base32', token, window: 1 });
  }
}
