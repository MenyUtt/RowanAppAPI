import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Injectable()
export class AuthService {

  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {
    
  }

  // --- Paso 1: Validar Usuario ---
  async validateUser(correo: string, contraseña: string) {
    const user = await this.usuariosService.findByEmail(correo);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(contraseña, user.contrasena);
    if (!isPasswordValid) throw new UnauthorizedException('Contraseña incorrecta');

    if (!user.activo) throw new UnauthorizedException('Usuario inactivo');
    if (user.esDosFactoresHabilitado) {
      return { require2fa: true, userId: user.id, message: 'Se requiere código de autenticación (TOTP)' };
    }

    return this.login(user);
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
  // --- Paso 2: Verificar 2FA y Login Final ---
  async verify2FAAndLogin(userId: number, code: string) { 
    const user = await this.usuariosService.findOne(userId);
    
    // Verificar si el usuario existe, tiene 2FA habilitado y tiene un secreto.
    if (!user || !user.esDosFactoresHabilitado || !user.codigo_2fa) {
      throw new UnauthorizedException('Solicitud inválida o 2FA no habilitado');
    }

    // 1. Validar el código TOTP
    const isValid = this.twoFactorAuthService.isCodeValid(code, user.codigo_2fa);

    if (!isValid) {
      throw new UnauthorizedException('Código de autenticación incorrecto');
    }

    // 2. Si es válido, se hace el login final.
    // Opcionalmente, podrías limpiar el campo codigo_2fa aquí si se usara para otra cosa,
    // pero para TOTP debe permanecer almacenando el secreto.

    // Generar JWT (Login exitoso)
    return this.login(user);
  }
  async setup2FA(user: any) {
    // 1. Generar secreto
    const secret = this.twoFactorAuthService.generateSecret();
    
    // 2. Generar el URL del código QR
    const otpAuthUrl = this.twoFactorAuthService.getOtpAuthUrl(secret, user.correo);

    // 3. Generar la imagen del QR code
    const qrCodeDataURL = await this.twoFactorAuthService.generateQrCodeDataURL(otpAuthUrl);

    // Opcional: Guardar el secreto TEMPORALMENTE en un campo para la verificación de activación, 
    // o simplemente retornarlo al cliente para que se envíe en el endpoint de verificación final.
    // Por simplicidad, lo retornaremos al cliente junto con el QR.

    return {
      secret: secret,
      qrCodeDataURL: qrCodeDataURL,
    };
  }
  // Verifica el código y activa TOTP permanentemente
  async activate2FA(userId: number, secret: string, token: string): Promise<boolean> {
    const user = await this.usuariosService.findOne(userId);
    
    if (!user) throw new BadRequestException('Usuario no encontrado');

    // 1. Verificar el código con el secreto temporal
    const isValid = this.twoFactorAuthService.isCodeValid(token, secret);

    if (!isValid) {
      return false;
    }

    // 2. Si es válido, guardar el secreto de forma permanente y habilitar 2FA.
    await this.usuariosService.update(userId, {
      esDosFactoresHabilitado: true,
      codigo_2fa: secret, // Guardar el secreto permanente
      // Limpiar campos de la lógica antigua si aún existen en la BD
      // expiracion_2fa: null 
    });

    return true;
  }

// Permite al usuario deshabilitar 2FA
  async disable2FA(userId: number): Promise<void> {
    await this.usuariosService.update(userId, {
        esDosFactoresHabilitado: false,
        codigo_2fa: null as any
    });
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