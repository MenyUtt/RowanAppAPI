// auth/dto/logout.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 'Bearer <token>' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
