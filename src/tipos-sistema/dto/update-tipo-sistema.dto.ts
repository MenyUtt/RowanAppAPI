import { PartialType } from '@nestjs/swagger';
import { CreateTipoSistemaDto } from './create-tipo-sistema.dto';

export class UpdateTipoSistemaDto extends PartialType(CreateTipoSistemaDto) {}
