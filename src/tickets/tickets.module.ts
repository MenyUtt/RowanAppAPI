import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { AsignacionTicket } from '../asignaciones-tickets/asignacion-ticket.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, AsignacionTicket, Usuario])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}