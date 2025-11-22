# EventFlow - Scalable Order Processing System

A distributed, event-driven microservices architecture for processing orders with real-time updates.

## Architecture Overview

- **Event-Driven Microservices**: Independent services communicating via RabbitMQ
- **Real-time Updates**: WebSocket gateway for frontend notifications
- **Decoupled Services**: Each service has its own PostgreSQL database
- **Infrastructure**: Docker Compose for local development

## Tech Stack

- **Frontend**: Next.js (App Router, TypeScript, Tailwind CSS, Socket.io-client)
- **Backend**: NestJS (Microservices mode), TypeORM/Prisma, RabbitMQ
- **Database**: PostgreSQL (per service) + Redis (Caching/Queue)
- **DevOps**: Docker, Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for services and frontend)
- Yarn (package manager)

## Quick Start

### 1. Clone and Setup Environment

```bash
# Copy environment variables
cp .env.example .env

# Edit .env if needed (defaults are fine for local dev)
```

### 2. Start Infrastructure

```bash
# Start all infrastructure services (PostgreSQL, RabbitMQ, Redis)
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs if needed
docker-compose logs -f
```

### 3. Access Management UIs

- **RabbitMQ Management**: http://localhost:15672
  - Username: `admin`
  - Password: `admin123`

### 4. Stop Infrastructure

```bash
docker-compose down

# To remove volumes (clean slate)
docker-compose down -v
```

## Project Structure

```
EventFlow/
├── docker-compose.yml          # Infrastructure orchestration
├── services/                   # Microservices
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   └── notification-service/
├── frontend/                   # Next.js application
│   └── nextjs-app/
└── shared/                     # Shared libraries
    ├── common/
    ├── events/
    └── utils/
```

## Development Workflow

1. Start infrastructure: `docker-compose up -d`
2. Start microservices (each in its own terminal)
3. Start frontend: `cd frontend/nextjs-app && yarn dev`

## Next Steps

- [ ] Setup Order Service
- [ ] Setup Payment Service
- [ ] Setup Inventory Service
- [ ] Setup Notification Service (WebSocket Gateway)
- [ ] Setup Frontend Application
- [ ] Setup Shared Libraries

## License

MIT



