import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosCaptchaController } from './usuarios.captcha.controller';
import { HttpModule } from '@nestjs/axios';
import { Usuario } from './usuario.entity';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), RolesModule, HttpModule],
  controllers: [UsuariosController, UsuariosCaptchaController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}