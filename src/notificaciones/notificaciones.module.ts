import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './notificacion.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TicketsModule } from '../tickets/tickets.module';
import { NotificacionesController } from './notificaciones.controller';
import { NotificacionesService } from './notificaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion]),
    UsuariosModule,
    TicketsModule,
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
