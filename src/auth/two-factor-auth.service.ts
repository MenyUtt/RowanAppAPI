import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  private readonly appName: string;

  constructor(private readonly configService: ConfigService) {
    // Usar un nombre de app de la configuración (o un valor fijo)
    this.appName = this.configService.get('TWO_FACTOR_APP_NAME') || 'RowanApp';
  }

  // Genera un secreto para el usuario
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  // Genera el URL para el código QR
  getOtpAuthUrl(secret: string, email: string): string {
    return authenticator.keyuri(email, this.appName, secret);
  }

  // Genera el código QR como un Data URL (base64)
  async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpAuthUrl);
  }

  // Verifica el código TOTP
  isCodeValid(token: string, secret: string): boolean {
    // Verifica el código con el secreto, permitiendo una ventana de tiempo (por defecto 1 paso)
    return authenticator.verify({ token, secret });
  }
}