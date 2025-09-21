import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto, QueryTicketsDto } from './dto';
import { Queue } from 'bullmq';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('tickets') private readonly ticketsQueue: Queue,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({
      data: createTicketDto,
    });

    await this.ticketsQueue.add(
      'notify',
      { ticketId: ticket.id },
      {
        jobId: `notify-${ticket.id}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    await this.ticketsQueue.add(
      'sla',
      { ticketId: ticket.id },
      {
        jobId: `sla-${ticket.id}`,
        delay: 15 * 60 * 1000,
        removeOnComplete: true,
      },
    );

    return ticket;
  }

  async findAll(queryDto: QueryTicketsDto) {
    const {
      status,
      priority,
      search,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryDto;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      tickets: tickets,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    await this.findOne(id);

    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
