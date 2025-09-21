import { Controller, Get, Param } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('admin/queues')
export class QueuesAdminController {
  constructor(@InjectQueue('tickets') private readonly ticketsQueue: Queue) {}

  @Get(':name/stats')
  async stats(@Param('name') name: string) {
    const counts = await this.ticketsQueue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    );
    return counts;
  }
}
