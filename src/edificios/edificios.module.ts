import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edificio } from './edificio.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { EdificiosController } from './edificios.controller';
import { EdificiosService } from './edificios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Edificio]),
    TicketsModule,
  ],
  controllers: [EdificiosController],
  providers: [EdificiosService],
})
export class EdificiosModule {}
