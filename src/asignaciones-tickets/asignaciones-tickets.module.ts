import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionTicket } from './asignacion-ticket.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TicketsModule } from '../tickets/tickets.module';
import { AsignacionesTicketsController } from './asignaciones-tickets.controller';
import { AsignacionesTicketsService } from './asignaciones-tickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AsignacionTicket]),
    UsuariosModule,
    TicketsModule,
  ],
  controllers: [AsignacionesTicketsController],
  providers: [AsignacionesTicketsService],
})
export class AsignacionesTicketsModule {}
