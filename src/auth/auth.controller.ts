import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto'; <--- Ya no usaremos este para el login principal
import { LoginStep1Dto } from './dto/login-step1.dto'; // <--- Nuevo DTO
import { Verify2faDto } from './dto/verify-2fa.dto'; 
import { Activate2faDto } from './dto/activate-2fa.dto';  // <--- Nuevo DTO
import { LogoutDto } from './dto/logout.dto';
import { MeDto } from './dto/me.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-step1')
  @ApiOperation({ summary: 'Paso 1: Validar credenciales y Captcha. Envía código 2FA.' })
  @ApiResponse({ status: 201, description: 'Credenciales válidas, se requiere 2FA' })
  @ApiResponse({ status: 401, description: 'Credenciales o Captcha inválidos' })
  async loginStep1(@Body() loginDto: LoginStep1Dto) {
    
    // 1. Validar Captcha
    const isCaptchaValid = await this.authService.validateRecaptcha(loginDto.recaptchaToken);
    if (!isCaptchaValid) {
      throw new UnauthorizedException('Captcha inválido');
    }
    

    // 2. Validar Usuario y Contraseña
    const user = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );

    return user;
  }

  @Post('login-verify-2fa')
  @ApiOperation({ summary: 'Paso 2: Verificar código enviado por correo y devolver JWT' })
  @ApiResponse({ status: 201, description: 'Login exitoso con 2FA' })
  async verify2FA(@Body() verifyDto: Verify2faDto) {
    return this.authService.verify2FAAndLogin(verifyDto.userId, verifyDto.code);
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
  @UseGuards(JwtAuthGuard)
  @Get('2fa/setup')
  async setup2fa(@Req() req) {
    // Asume que el request tiene el usuario JWT inyectado
    return this.authService.setup2FA(req.user); 
  }
  @UseGuards(JwtAuthGuard)
  @Post('2fa/activate')
  async activate2fa(@Req() req, @Body() activateDto: Activate2faDto) {
    // La activación requiere el secreto TEMPORAL enviado por el frontend 
    // y el código de 6 dígitos que generó el autenticador
    const activationResult = await this.authService.activate2FA(
        req.user.id,
        activateDto.secret,
        activateDto.token,
    );

    if (!activationResult) {
        throw new UnauthorizedException('Código o secreto inválido.');
    }
    return { message: 'Autenticación de dos factores habilitada.' };
  }

  // RUTA NUEVA: Deshabilitar 2FA
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  async disable2fa(@Req() req) {
    await this.authService.disable2FA(req.user.id);
    return { message: 'Autenticación de dos factores deshabilitada.' };
  }
}