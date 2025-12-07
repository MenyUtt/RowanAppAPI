import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TiposSistemaService } from './tipos-sistema.service';
import { TipoSistema } from './tipo-sistema.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTipoSistemaDto } from './dto/create-tipo-sistema.dto';
import { UpdateTipoSistemaDto } from './dto/update-tipo-sistema.dto';

@ApiTags('Tipos de Sistema')
@Controller('tipos-sistema')
export class TiposSistemaController {
  constructor(private readonly tiposSistemaService: TiposSistemaService) {}

  @ApiOperation({ summary: 'Obtener todos los tipos de sistema' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de sistema obtenida correctamente.', type: [TipoSistema] })
  @Get()
  findAll(): Promise<TipoSistema[]> {
    return this.tiposSistemaService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un tipo de sistema por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de sistema obtenido correctamente.', type: TipoSistema })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<TipoSistema | null> {
    return this.tiposSistemaService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo tipo de sistema' })
  @ApiResponse({ status: 201, description: 'Tipo de sistema creado correctamente.', type: TipoSistema })
  @Post()
  create(@Body() createTipoDto: CreateTipoSistemaDto): Promise<TipoSistema> {
    return this.tiposSistemaService.create(createTipoDto);
  }

  @ApiOperation({ summary: 'Actualizar un tipo de sistema' })
  @ApiResponse({ status: 200, description: 'Tipo de sistema actualizado correctamente.', type: TipoSistema })
  @Put(':id')
  update(@Param('id') id: number, @Body() updateTipoDto: UpdateTipoSistemaDto) {
    return this.tiposSistemaService.update(id, updateTipoDto);
  }

  @ApiOperation({ summary: 'Eliminar un tipo de sistema' })
  @ApiResponse({ status: 200, description: 'Tipo de sistema eliminado correctamente.' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tiposSistemaService.remove(id);
  }
}
