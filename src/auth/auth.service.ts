import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter;

  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    // Configurar el transportador de correo
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  // --- Paso 1: Validar Usuario ---
  async validateUser(correo: string, contraseña: string) {
    const user = await this.usuariosService.findByEmail(correo);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(contraseña, user.contrasena);
    if (!isPasswordValid) throw new UnauthorizedException('Contraseña incorrecta');

    if (!user.activo) throw new UnauthorizedException('Usuario inactivo');

    return user;
  }

  // --- Utilidad: Validar Captcha con Google ---
  async validateRecaptcha(token: string): Promise<boolean> {
    const secret = this.configService.get<string>('GOOGLE_RECAPTCHA_SECRET');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    try {
      const response$ = this.httpService.post(url);
      const response = await lastValueFrom(response$);
      
      if (!response.data.success) {
        console.log('Error reCAPTCHA:', response.data['error-codes']);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validando reCAPTCHA', error);
      return false;
    }
  }

  // --- Lógica 2FA: Generar y Guardar Código ---
  async generateAndSend2FA(user: any) {
    // 1. Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Establecer expiración (5 minutos)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    // 3. Guardar en BD (Usando el update del UsuariosService)
    await this.usuariosService.update(user.id, {
      codigo_2fa: code,
      expiracion_2fa: expires,
    });

    // 4. Enviar correo
    try {
      await this.transporter.sendMail({
        from: '"Soporte RowanApp" <no-reply@rowanapp.com>',
        to: user.correo,
        subject: 'Tu código de verificación - RowanApp',
        text: `Tu código de acceso es: ${code}. Expira en 5 minutos.`,
        html: `<b>Tu código de acceso es: ${code}</b><br>Expira en 5 minutos.`,
      });
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new InternalServerErrorException('No se pudo enviar el código de verificación');
    }

    return { require2fa: true, userId: user.id, message: 'Código enviado al correo' };
  }

  // --- Paso 2: Verificar 2FA y Login Final ---
  async verify2FAAndLogin(userId: number, code: string) {
    const user = await this.usuariosService.findOne(userId);
    
    if (!user || !user.codigo_2fa || !user.expiracion_2fa) {
      throw new UnauthorizedException('Solicitud inválida o código no generado');
    }

    if (new Date() > user.expiracion_2fa) {
      throw new UnauthorizedException('El código ha expirado');
    }

    if (user.codigo_2fa !== code) {
      throw new UnauthorizedException('Código incorrecto');
    }

    // Limpiar el código usado
    await this.usuariosService.update(user.id, {
      codigo_2fa: null as any, // @ts-ignore: typeorm maneja null si la columna lo permite
      expiracion_2fa: null // @ts-ignore
    });

    // Generar JWT (Login exitoso)
    return this.login(user);
  }

  // --- Generar Token JWT (Método existente) ---
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