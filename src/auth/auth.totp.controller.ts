import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { TotpService } from './totp.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth-totp')
export class AuthTotpController {
  constructor(
    private totp: TotpService,
    private usuariosService: UsuariosService,
    private authService: AuthService,
  ) {}

  // Generar secret y QR para que el usuario lo configure en su app Authenticator
  @UseGuards(JwtAuthGuard)
  @Post('setup')
  async setup(@Req() req: any) {
    const user = await this.usuariosService.findOne(req.user.id);
    if (!user) throw new UnauthorizedException();
    return this.totp.generateSecret(user.id);
  }

  // Verificar token TOTP y completar login (alternativa a 2FA por correo)
  @Post('verify-login')
  async verifyLogin(@Body() body: { userId: number; token: string }) {
    const user = await this.usuariosService.findOne(body.userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    const ok = await this.totp.verifyToken(body.userId, body.token);
    if (!ok) throw new UnauthorizedException('Código TOTP inválido');
    // Generar JWT y devolverlo (reutiliza AuthService.login)
    return this.authService.login(user);
  }
}
