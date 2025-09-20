import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'title must be at least 5 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'description must be at most 5000 characters' })
  description: string;

  @IsEnum(Priority, { message: 'priority must be LOW | MEDIUM | HIGH' })
  priority: Priority;

  @IsEnum(Status, { message: 'status must be OPEN | IN_PROGRESS | RESOLVED' })
  @IsOptional()
  status?: Status;
}
