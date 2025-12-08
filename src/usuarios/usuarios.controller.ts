import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [Usuario] })
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }
  
  @Get('tecnicos')
  findTecnicos(): Promise<Usuario[]> {
    return this.usuariosService.findTecnicos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: Usuario })
  findOne(@Param('id') id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: Usuario })
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente (Por el momento solo rol)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: Usuario })
  update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Put(':id/fcm-token')
  async updateFcmToken(@Param('id') id: number, @Body('token') token: string) {
  return this.usuariosService.update(id, { fcm_token: token } as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (Despues se desactivara por el momento lo extermina)' })
  remove(@Param('id') id: number) {
    return this.usuariosService.remove(id);
  }
}
