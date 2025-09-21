import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('tickets')
export class TicketsProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === 'notify') {
      console.log('📣 TicketNotifyJob:', job.id, job.data);
      return;
    }

    if (job.name === 'sla') {
      const { ticketId } = job.data as { ticketId: number };
      const t = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!t) return;
      if (t.status !== 'RESOLVED') {
        console.warn('⏰ TicketSlaJob: SLA check fired for ticket', ticketId);
      }
      return;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log('✅ job completed:', job.name, job.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error('❌ job failed:', job?.name, job?.id, err?.message);
  }
}
