import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('por-edificio/:id')
  findByEdificio(@Param('id') id: string): Promise<Ticket[]> {
    return this.ticketsService.findByEdificio(+id);
  }

  @Post()
  create(@Body() ticketData: any): Promise<Ticket> {
    return this.ticketsService.create(ticketData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any): Promise<Ticket> {
    return this.ticketsService.update(+id, updateData);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
