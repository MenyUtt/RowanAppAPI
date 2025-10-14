import { PartialType } from '@nestjs/swagger';
import { CreateHistorialStatusDto } from './create-historial-status.dto';

export class UpdateHistorialStatusDto extends PartialType(CreateHistorialStatusDto) {}
