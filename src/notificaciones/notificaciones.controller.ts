import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificacion } from './notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  findAll(): Promise<Notificacion[]> {
    return this.notificacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  findOne(@Param('id') id: number): Promise<Notificacion | null> {
    return this.notificacionesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  create(@Body() dto: CreateNotificacionDto): Promise<Notificacion> {
    return this.notificacionesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una notificación existente' })
  update(@Param('id') id: number, @Body() dto: UpdateNotificacionDto) {
    return this.notificacionesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  remove(@Param('id') id: number) {
    return this.notificacionesService.remove(id);
  }
}
