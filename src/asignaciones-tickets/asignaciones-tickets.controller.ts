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

  @Post('asignar')
    @ApiOperation({ summary: 'Asignar un ticket a un empleado (crear o actualizar asignación)' })
    async asignar(@Body() body: any): Promise<AsignacionTicket> {
      // support either { ticket_id, empleado_id } or { ticket: { id }, empleado: { id } }
      const ticketId = body.ticket_id || (body.ticket && body.ticket.id) || (body.ticketId || body.ticket?.ticketId);
      const empleadoId = body.empleado_id || (body.empleado && body.empleado.id) || (body.empleadoId || body.empleado?.usuarioId);
      if (!ticketId || !empleadoId) {
        throw new Error('ticket_id and empleado_id are required');
      }
      return this.asignacionesService.assign(Number(ticketId), Number(empleadoId));
    }
}
