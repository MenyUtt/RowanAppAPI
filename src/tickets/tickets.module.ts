import { Module, forwardRef } from '@nestjs/common'; // <--- 1. IMPORTAR forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { AsignacionTicket } from '../asignaciones-tickets/asignacion-ticket.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, AsignacionTicket, Usuario]),
    forwardRef(() => NotificacionesModule), // <--- 2. USAR forwardRef AQUÍ
    UsuariosModule
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService], // Es buena práctica exportarlo si otros lo usan
})
export class TicketsModule {}