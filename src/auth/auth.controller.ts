import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LogoutDto } from './dto/logout.dto';
import { MeDto } from './dto/me.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 201, description: 'Login exitoso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );
    return this.authService.login(user);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(@Body() logoutDto: LogoutDto) {
    // Aquí podrías invalidar el token en DB o en cache si implementas blacklist
    return { message: 'Logout exitoso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario logueado' })
  @ApiResponse({ status: 200, description: 'Usuario actual', type: MeDto })
  getProfile(@Req() req) {
    return req.user;
  }
}
