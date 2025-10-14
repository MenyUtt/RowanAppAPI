import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSistema } from './tipo-sistema.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { TiposSistemaController } from './tipos-sistema.controller';
import { TiposSistemaService } from './tipos-sistema.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoSistema]),
    TicketsModule
  ],
  controllers: [TiposSistemaController],
  providers: [TiposSistemaService],
})
export class TiposSistemaModule {}
