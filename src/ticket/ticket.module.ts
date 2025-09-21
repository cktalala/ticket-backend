import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { QueuesAdminController } from './queues-admin.controller';
import { TicketsProcessor } from './tickets.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'tickets',
    }),
  ],
  controllers: [TicketController, QueuesAdminController],
  providers: [TicketService, TicketsProcessor],
})
export class TicketModule {}
