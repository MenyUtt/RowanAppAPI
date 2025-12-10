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
import { FirebaseModule } from './firebase/firebase.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

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
      synchronize: true, // para desarrollo, NO producción
      autoLoadEntities: true, // importante para que cargue todas las entidades automáticamente
    }),
    // SERVIR FRONT-END
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web'), // la carpeta web está en la raíz del proyecto
      exclude: ['/api*'], // rutas de API no se servirán como archivos estáticos
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
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
