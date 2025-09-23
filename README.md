# Ticket Backend

A NestJS-based ticket management system with PostgreSQL database, Redis queue processing, and comprehensive API endpoints.

## Features

- **CRUD Operations**: Full ticket lifecycle management
- **Queue Processing**: Background job processing with BullMQ
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Request validation with class-validator
- **Error Handling**: Global exception filters and response interceptors
- **Admin Interface**: Queue monitoring and statistics

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Queue**: Redis + BullMQ
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL
- Redis

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ticket-backend
yarn install
```

### 2. Environment Setup

Create `.env` file:

```env
DATABASE_URL=""
REDIS_HOST=
REDIS_PORT=
PORT=3001
```

### 3. Start Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start development server
yarn start:dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Tickets

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | `/tickets`     | Create ticket               |
| GET    | `/tickets`     | List tickets (with filters) |
| GET    | `/tickets/:id` | Get ticket by ID            |
| PATCH  | `/tickets/:id` | Update ticket               |
| DELETE | `/tickets/:id` | Delete ticket               |

### Admin

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| GET    | `/admin/queues/:name/stats` | Queue statistics |

## Data Models

### Ticket

```typescript
{
  id: number;
  title: string; // min 5 chars
  description: string; // max 5000 chars
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## Queue Jobs

- **notify**: Notification processing
- **sla**: SLA monitoring and alerts

## Scripts

```bash
# Development
yarn start:dev        # Watch mode
yarn start:debug      # Debug mode

# Production
yarn build           # Build application
yarn start:prod      # Production mode

# Testing
yarn test           # Unit tests
yarn test:e2e       # E2E tests
yarn test:cov       # Coverage report

# Code Quality
yarn lint           # ESLint
yarn format         # Prettier
```

## Docker Services

- **PostgreSQL**: Database (port 5432)
- **Redis**: Queue backend (port 6379)

## Project Structure

```
src/
├── common/             # Shared utilities
│   ├── filters/        # Exception filters
│   ├── interceptors/   # Response interceptors
│   └── interfaces/     # Type definitions
├── prisma/            # Database module
├── ticket/            # Ticket module
│   ├── dto/           # Data transfer objects
│   ├── ticket.controller.ts
│   ├── ticket.service.ts
│   ├── tickets.processor.ts
│   └── queues-admin.controller.ts
└── main.ts            # Application entry point
```

## Development

### Database Changes

```bash
# Update schema
npx prisma db push

# Generate client
npx prisma generate

# View database
npx prisma studio
```

### Queue Monitoring

Access queue stats via `/admin/queues/tickets/stats`
