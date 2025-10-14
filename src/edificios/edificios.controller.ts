import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EdificiosService } from './edificios.service';
import { Edificio } from './edificio.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEdificioDto } from './dto/create-edificio.dto';
import { UpdateEdificioDto } from './dto/update-edificio.dto';

@ApiTags('Edificios')
@Controller('edificios')
export class EdificiosController {
  constructor(private readonly edificiosService: EdificiosService) {}

  @ApiOperation({ summary: 'Obtener todos los edificios' })
  @ApiResponse({ status: 200, description: 'Lista de edificios obtenida correctamente.', type: [Edificio] })
  @Get()
  findAll(): Promise<Edificio[]> {
    return this.edificiosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener edificio por ID' })
  @ApiResponse({ status: 200, description: 'Edificio obtenido correctamente.', type: Edificio })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Edificio | null> {
    return this.edificiosService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear nuevo edificio' })
  @ApiResponse({ status: 201, description: 'Edificio creado correctamente.', type: Edificio })
  @Post()
  create(@Body() createEdificioDto: CreateEdificioDto): Promise<Edificio> {
    return this.edificiosService.create(createEdificioDto);
  }

  @ApiOperation({ summary: 'Actualizar edificio' })
  @ApiResponse({ status: 200, description: 'Edificio actualizado correctamente.', type: Edificio })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateEdificioDto: UpdateEdificioDto) {
    return this.edificiosService.update(id, updateEdificioDto);
  }

  @ApiOperation({ summary: 'Eliminar edificio' })
  @ApiResponse({ status: 200, description: 'Edificio eliminado correctamente.' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.edificiosService.remove(id);
  }
}
