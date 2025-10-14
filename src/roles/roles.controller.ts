import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles', type: [Rol] })
  findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({ status: 200, description: 'Rol encontrado', type: Rol })
  findOne(@Param('id') id: number): Promise<Rol> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({ status: 201, description: 'Rol creado', type: Rol })
  create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolesService.create(createRolDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un rol existente' })
  @ApiResponse({ status: 200, description: 'Rol actualizado', type: Rol })
  update(@Param('id') id: number, @Body() updateRolDto: UpdateRolDto) {
    return this.rolesService.update(id, updateRolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol' })
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
