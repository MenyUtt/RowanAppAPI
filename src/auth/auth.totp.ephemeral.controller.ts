import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { TotpEphemeralService } from './totp.ephemeral.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth-totp')
export class AuthTotpEphemeralController {
  constructor(
    private ephemeral: TotpEphemeralService,
    private usuariosService: UsuariosService,
    private authService: AuthService,
  ) {}

  // Protected endpoint: generate ephemeral secret + QR for user to scan
  @UseGuards(JwtAuthGuard)
  @Post('ephemeral/setup')
  async setup(@Req() req: any) {
    const user = await this.usuariosService.findOne(req.user.id);
    if (!user) throw new UnauthorizedException();
    return this.ephemeral.generate(user.id);
  }

  // Unauthenticated ephemeral setup: used immediately after step1 login when we only
  // have the userId. This is intentionally ephemeral (no persistence) and short-lived.
  @Post('ephemeral/setup-anon')
  async setupAnon(@Body() body: { userId: number }) {
    const user = await this.usuariosService.findOne(body.userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return this.ephemeral.generate(user.id);
  }

  // Verify ephemeral TOTP and return JWT (same as verify-login but using ephemeralId)
  @Post('ephemeral/verify-login')
  async verifyLogin(@Body() body: { ephemeralId: string; userId: number; token: string }) {
    const user = await this.usuariosService.findOne(body.userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    this.ephemeral.verify(body.ephemeralId, body.userId, body.token);
    return this.authService.login(user);
  }
}
