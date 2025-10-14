import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from 'src/tickets/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('edificios')
export class Edificio {
  @ApiProperty({ example: 1, description: 'ID del edificio' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Edificio Central', description: 'Nombre del edificio' })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', description: 'Dirección del edificio' })
  @Column({ length: 255 })
  direccion: string;

  @ApiProperty({ type: () => [Ticket], description: 'Tickets asociados al edificio', required: false })
  @OneToMany(() => Ticket, ticket => ticket.edificio)
  tickets: Ticket[];
}
