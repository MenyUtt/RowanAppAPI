import { Injectable, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { randomBytes } from 'crypto';

type EphemeralEntry = {
  userId: number;
  secret: string; // base32
  expiresAt: number;
};

@Injectable()
export class TotpEphemeralService {
  private store = new Map<string, EphemeralEntry>();
  private ttlMs = 10 * 60 * 1000; // 10 minutes

  async generate(userId: number) {
    const secret = speakeasy.generateSecret({ length: 20 });
    const id = randomBytes(12).toString('hex');
    const expiresAt = Date.now() + this.ttlMs;

    this.store.set(id, { userId, secret: secret.base32, expiresAt });

    const otpauth = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `RowanApp (${userId})`,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
      encoding: 'base32',
    });

    const qr = await qrcode.toDataURL(otpauth);
    // Schedule cleanup (non-critical if process restarts)
    setTimeout(() => this.store.delete(id), this.ttlMs + 1000);

    return { ephemeralId: id, secret: secret.base32, otpauth, qr, expiresAt };
  }

  verify(ephemeralId: string, userId: number, token: string) {
    const entry = this.store.get(ephemeralId);
    if (!entry) throw new BadRequestException('Código efímero inválido o expirado');
    if (entry.userId !== userId) throw new BadRequestException('Identificador inválido para este usuario');
    if (Date.now() > entry.expiresAt) {
      this.store.delete(ephemeralId);
      throw new BadRequestException('Código efímero expirado');
    }

    const ok = speakeasy.totp.verify({ secret: entry.secret, encoding: 'base32', token, window: 1 });
    if (!ok) throw new BadRequestException('Token TOTP inválido');

    // one-time use
    this.store.delete(ephemeralId);
    return true;
  }
}
