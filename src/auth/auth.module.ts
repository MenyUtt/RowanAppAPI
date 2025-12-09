import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios'; // <--- IMPORTANTE
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TotpService } from './totp.service';
import { AuthTotpController } from './auth.totp.controller';
import { TotpEphemeralService } from './totp.ephemeral.service';
import { AuthTotpEphemeralController } from './auth.totp.ephemeral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioTotp } from 'src/usuarios/usuario-totp.entity';
import { AuthCaptchaController } from './auth.captcha.controller';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    TypeOrmModule.forFeature([UsuarioTotp]),
    ConfigModule,
    HttpModule, // <--- AGREGARLO AQUÍ
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, TwoFactorAuthService, TotpService, TotpEphemeralService],
  controllers: [AuthController, AuthCaptchaController, AuthTotpController, AuthTotpEphemeralController],
})
export class AuthModule {}