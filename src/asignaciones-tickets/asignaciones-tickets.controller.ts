import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AsignacionesTicketsService } from './asignaciones-tickets.service';
import { AsignacionTicket } from './asignacion-ticket.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Asignaciones Tickets')
@Controller('asignaciones-tickets')
export class AsignacionesTicketsController {
  constructor(private readonly asignacionesService: AsignacionesTicketsService) {}

  @ApiOperation({ summary: 'Obtener todas las asignaciones de tickets' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones obtenida correctamente.', type: [AsignacionTicket] })
  @Get()
  findAll(): Promise<AsignacionTicket[]> {
    return this.asignacionesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener asignación por ID' })
  @ApiResponse({ status: 200, description: 'Asignación obtenida correctamente.', type: AsignacionTicket })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<AsignacionTicket | null> {
    return this.asignacionesService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear nueva asignación de ticket' })
  @ApiResponse({ status: 201, description: 'Asignación creada correctamente.', type: AsignacionTicket })
  @Post()
  create(@Body() data: Partial<AsignacionTicket>): Promise<AsignacionTicket> {
    return this.asignacionesService.create(data);
  }

  @ApiOperation({ summary: 'Actualizar asignación de ticket' })
  @ApiResponse({ status: 200, description: 'Asignación actualizada correctamente.', type: AsignacionTicket })
  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<AsignacionTicket>) {
    return this.asignacionesService.update(id, data);
  }

  @ApiOperation({ summary: 'Eliminar asignación de ticket' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada correctamente.' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.asignacionesService.remove(id);
  }
}
