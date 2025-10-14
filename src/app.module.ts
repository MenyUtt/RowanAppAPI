import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AsignacionesTicketsModule } from './asignaciones-tickets/asignaciones-tickets.module';
import { EdificiosModule } from './edificios/edificios.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { HistorialStatusModule } from './historial-status/historial-status.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { TicketsModule } from './tickets/tickets.module';
import { TiposSistemaModule } from './tipos-sistema/tipos-sistema.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false, // para desarrollo, NO producción
      autoLoadEntities: true, // importante para que cargue todas las entidades automáticamente
    }),
    UsuariosModule,
    RolesModule,
    AuthModule,
    AsignacionesTicketsModule,
    EdificiosModule,
    EvidenciasModule,
    HistorialStatusModule,
    NotificacionesModule,
    TicketsModule,
    TiposSistemaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
