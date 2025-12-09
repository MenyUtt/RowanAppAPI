import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('usuarios-captcha')
export class UsuariosCaptchaController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private async validateRecaptcha(token: string): Promise<boolean> {
    const secret =
      this.configService.get<string>('RECAPTCHA_SECRET') || process.env.RECAPTCHA_SECRET;
    if (!secret) return false;

    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({ secret, response: token });
    try {
      const response$ = this.httpService.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const response = await lastValueFrom(response$);
      return Boolean(response.data && response.data.success);
    } catch (err) {
      return false;
    }
  }

  @Post()
  async createWithCaptcha(@Body() body: any) {
    const recaptchaToken = body.recaptchaToken as string;
    if (!recaptchaToken) {
      throw new BadRequestException('recaptchaToken requerido');
    }

    const ok = await this.validateRecaptcha(recaptchaToken);
    if (!ok) {
      throw new BadRequestException('Captcha inválido');
    }

    // Construir payload esperado por UsuariosService.create
    const payload = {
      nombre: body.nombre,
      apellidos: body.apellidos,
      correo: body.correo,
      contrasena: body.contrasena,
      telefono: body.telefono,
      rol_id: body.rol_id,
      activo: body.activo,
    };

    return this.usuariosService.create(payload);
  }
}
