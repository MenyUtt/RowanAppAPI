import { Module, forwardRef } from '@nestjs/common'; // <--- 1. IMPORTAR forwardRef
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
    forwardRef(() => TicketsModule), // <--- 2. USAR forwardRef AQUÍ
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService], // Exportamos para que TicketsModule pueda usar el servicio
})
export class NotificacionesModule {}