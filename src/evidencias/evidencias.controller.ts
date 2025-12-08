import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Res, HttpStatus } from '@nestjs/common';
import { EvidenciasService } from './evidencias.service';
import { Evidencia } from './evidencia.entity';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Evidencias')
@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir imagen de evidencia' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Carpeta donde se guardan
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any, @Body() body: any) {
    if (!file) {
      throw new Error('No se subió ningún archivo');
    }

    // URL para acceder a la imagen
    const fileUrl = `/uploads/${file.filename}`;

    // Crear registro en BD
    return this.evidenciasService.create({
      ticket_id: parseInt(body.ticketId),
      usuario_id: parseInt(body.usuarioId),
      tipo_archivo: body.tipo || 'imagen',
      url_archivo: fileUrl
    });
  }

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
