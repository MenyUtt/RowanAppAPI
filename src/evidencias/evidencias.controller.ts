import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EvidenciasService } from './evidencias.service';
import { Evidencia } from './evidencia.entity';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Evidencias')
@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las evidencias' })
  @ApiResponse({ status: 200, description: 'Lista de evidencias', type: [Evidencia] })
  findAll(): Promise<Evidencia[]> {
    return this.evidenciasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evidencia por ID' })
  @ApiResponse({ status: 200, description: 'Evidencia encontrada', type: Evidencia })
  findOne(@Param('id') id: number): Promise<Evidencia | null> {
    return this.evidenciasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva evidencia' })
  @ApiResponse({ status: 201, description: 'Evidencia creada correctamente', type: Evidencia })
  create(@Body() data: CreateEvidenciaDto): Promise<Evidencia> {
    return this.evidenciasService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una evidencia existente' })
  @ApiResponse({ status: 200, description: 'Evidencia actualizada correctamente' })
  update(@Param('id') id: number, @Body() data: UpdateEvidenciaDto) {
    return this.evidenciasService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una evidencia por ID' })
  @ApiResponse({ status: 200, description: 'Evidencia eliminada correctamente' })
  remove(@Param('id') id: number) {
    return this.evidenciasService.remove(id);
  }
}
