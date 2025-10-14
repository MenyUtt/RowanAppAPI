import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from './rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
