import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginStep1Dto } from './dto/login-step1.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { LogoutDto } from './dto/logout.dto';
import { MeDto } from './dto/me.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth-captcha')
@Controller('auth-captcha')
export class AuthCaptchaController {
  constructor(private authService: AuthService) {}

  @Post('login-step1')
  @ApiOperation({ summary: 'Paso 1 (con captcha): Validar credenciales y Captcha. Envía código 2FA.' })
  @ApiResponse({ status: 201, description: 'Credenciales válidas, se requiere 2FA' })
  @ApiResponse({ status: 401, description: 'Credenciales o Captcha inválidos' })
  async loginStep1(@Body() loginDto: LoginStep1Dto) {
    // 1. Validar Captcha
    const isCaptchaValid = await this.authService.validateRecaptcha2(loginDto.recaptchaToken);
    if (!isCaptchaValid) {
      throw new UnauthorizedException('Captcha inválido');
    }

    // 2. Validar Usuario y Contraseña
    const user = await this.authService.validateUser2(
      loginDto.correo,
      loginDto.contrasena,
    );

    // 3. Generar Código y Enviar Correo
    return this.authService.generateAndSend2FA(user);
  }

  @Post('login-step1-totp')
  @ApiOperation({ summary: 'Paso 1 alternativo (con captcha): Validar credenciales pero NO enviar correo — usado para TOTP/QR' })
  @ApiResponse({ status: 200, description: 'Credenciales válidas, devuelve userId para continuar con TOTP' })
  async loginStep1Totp(@Body() loginDto: LoginStep1Dto) {
    // 1. Validar Captcha
    const isCaptchaValid = await this.authService.validateRecaptcha2(loginDto.recaptchaToken);
    if (!isCaptchaValid) {
      throw new UnauthorizedException('Captcha inválido');
    }

    // 2. Validar Usuario y Contraseña
    const user = await this.authService.validateUser2(
      loginDto.correo,
      loginDto.contrasena,
    );

    // 3. No enviamos correo aquí — el frontend usará el flujo TOTP/QR efímero
    return { require2fa: true, userId: user.id, message: 'Credenciales válidas. Continúa con TOTP/QR.' };
  }

  @Post('login-verify-2fa')
  @ApiOperation({ summary: 'Paso 2: Verificar código enviado por correo y devolver JWT' })
  @ApiResponse({ status: 201, description: 'Login exitoso con 2FA' })
  async verify2FA(@Body() verifyDto: Verify2faDto) {
    return this.authService.verify2FAAndLogin2(verifyDto.userId, verifyDto.code);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(@Body() logoutDto: LogoutDto) {
    return { message: 'Logout exitoso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario logueado' })
  getProfile(@Req() req) {
    return req.user;
  }
}
