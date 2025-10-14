import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { HistorialStatusService } from './historial-status.service';
import { HistorialStatus } from './historial-status.entity';
import { CreateHistorialStatusDto } from './dto/create-historial-status.dto';
import { UpdateHistorialStatusDto } from './dto/update-historial-status.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Historial de Status')
@Controller('historial-status')
export class HistorialStatusController {
  constructor(private readonly historialService: HistorialStatusService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los historiales de status' })
  findAll(): Promise<HistorialStatus[]> {
    return this.historialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un historial de status por ID' })
  findOne(@Param('id') id: number): Promise<HistorialStatus | null> {
    return this.historialService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo historial de status' })
  create(@Body() dto: CreateHistorialStatusDto): Promise<HistorialStatus> {
    return this.historialService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un historial de status existente' })
  update(@Param('id') id: number, @Body() dto: UpdateHistorialStatusDto) {
    return this.historialService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un historial de status' })
  remove(@Param('id') id: number) {
    return this.historialService.remove(id);
  }
}
