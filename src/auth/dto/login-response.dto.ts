// auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      correo: 'usuario@correo.com',
      rol: 'admin',
      nombre: 'Juan',
      apellidos: 'Pérez',
    },
  })
  usuario: {
    id: number;
    correo: string;
    rol: string;
    nombre: string;
    apellidos: string;
  };
}
