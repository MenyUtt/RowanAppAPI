import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialStatus } from './historial-status.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TicketsModule } from '../tickets/tickets.module';
import { HistorialStatusController } from './historial-status.controller';
import { HistorialStatusService } from './historial-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialStatus]),
    UsuariosModule,
    TicketsModule,
  ],
  controllers: [HistorialStatusController],
  providers: [HistorialStatusService],
})
export class HistorialStatusModule {}
