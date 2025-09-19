import { Controller, Get, ValidationPipe, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { QueryTicketsDto } from './dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll(@Query(ValidationPipe) queryDto: QueryTicketsDto) {
    return this.ticketService.findAll(queryDto);
  }
}
