import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidencia } from './evidencia.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TicketsModule } from '../tickets/tickets.module';
import { EvidenciasController } from './evidencias.controller';
import { EvidenciasService } from './evidencias.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evidencia]),
    UsuariosModule,
    TicketsModule,
  ],
  controllers: [EvidenciasController],
  providers: [EvidenciasService],
})
export class EvidenciasModule {}
