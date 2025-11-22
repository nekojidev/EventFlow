# EventFlow - Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture Pattern](#architecture-pattern)
3. [System Components](#system-components)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Communication Patterns](#communication-patterns)
7. [Data Flow](#data-flow)
8. [Event-Driven Architecture](#event-driven-architecture)
9. [Design Patterns](#design-patterns)
10. [Scalability & Performance](#scalability--performance)
11. [Security Considerations](#security-considerations)
12. [Deployment Architecture](#deployment-architecture)

---

## Overview

**EventFlow** is a scalable, distributed order processing system built on **Event-Driven Microservices Architecture**. The system is designed to handle high-volume order processing with real-time updates, ensuring loose coupling, high availability, and horizontal scalability.

### Key Principles

- **Decoupling**: Services are independent and communicate asynchronously
- **Eventual Consistency**: System maintains consistency over time, not immediately
- **Fault Tolerance**: Failure in one service doesn't crash the entire system
- **Scalability**: Each service can scale independently based on load
- **Real-time Updates**: WebSocket gateway provides instant notifications to clients

---

## Architecture Pattern

### Event-Driven Microservices Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                    (Next.js Frontend)                           │
│                    WebSocket + HTTP                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│              (Notification Service - WebSocket Gateway)          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MESSAGE BROKER LAYER                         │
│                        (RabbitMQ)                               │
│              Exchanges, Queues, Routing Keys                    │
└───────────┬───────────────┬───────────────┬─────────────────────┘
            │               │               │
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│  Order Service   │ │Payment Service│ │Inventory Service│
│  (Port 3001)     │ │  (Port 3002)  │ │  (Port 3003)   │
│                  │ │               │ │               │
│  PostgreSQL      │ │  PostgreSQL   │ │  PostgreSQL   │
│  (Port 5432)     │ │  (Port 5433)  │ │  (Port 5434)  │
└──────────────────┘ └──────────────┘ └──────────────┘
```

### Architecture Characteristics

1. **Microservices**: Each service is independently deployable and scalable
2. **Event-Driven**: Services communicate via events through RabbitMQ
3. **Database per Service**: Each microservice has its own PostgreSQL database
4. **API Gateway Pattern**: Notification service acts as WebSocket gateway
5. **CQRS-like**: Commands (HTTP) and Events (RabbitMQ) separation

---

## System Components

### 1. Infrastructure Layer

#### Docker Compose Services

- **PostgreSQL (3 instances)**
  - `postgres-order` (Port 5432): Order service database
  - `postgres-payment` (Port 5433): Payment service database
  - `postgres-inventory` (Port 5434): Inventory service database
  
  **Why separate databases?**
  - True service independence
  - Independent scaling
  - Technology flexibility per service
  - Data isolation and security

- **RabbitMQ** (Ports 5672, 15672)
  - **AMQP Port (5672)**: Message broker communication
  - **Management UI (15672)**: Web interface for monitoring
  
  **Purpose:**
  - Asynchronous message queuing
  - Event routing and distribution
  - Service decoupling
  - Message persistence

- **Redis** (Port 6379)
  - **Purpose:**
    - Caching frequently accessed data
    - Session storage
    - Rate limiting
    - Optional queue support

### 2. Microservices Layer

#### Order Service (Port 3001)

**Responsibilities:**
- Order creation and management
- Order status tracking
- Order validation
- Order history

**Database:** `order_db` (PostgreSQL)

**Events Published:**
- `OrderCreatedEvent`
- `OrderUpdatedEvent`
- `OrderCancelledEvent`

**Events Consumed:**
- `PaymentProcessedEvent` (from Payment Service)
- `InventoryReservedEvent` (from Inventory Service)
- `InventoryReleasedEvent` (from Inventory Service)

**Business Logic:**
- Validates order items
- Calculates totals
- Manages order lifecycle
- Coordinates with payment and inventory services

#### Payment Service (Port 3002)

**Responsibilities:**
- Payment processing
- Transaction management
- Payment status tracking
- Refund processing

**Database:** `payment_db` (PostgreSQL)

**Events Published:**
- `PaymentInitiatedEvent`
- `PaymentProcessedEvent`
- `PaymentFailedEvent`
- `PaymentRefundedEvent`

**Events Consumed:**
- `OrderCreatedEvent` (from Order Service)

**Business Logic:**
- Processes payment transactions
- Handles payment failures
- Manages refunds
- Integrates with payment gateways (future)

#### Inventory Service (Port 3003)

**Responsibilities:**
- Inventory management
- Stock reservation
- Stock updates
- Low stock alerts

**Database:** `inventory_db` (PostgreSQL)

**Events Published:**
- `InventoryReservedEvent`
- `InventoryReleasedEvent`
- `InventoryUpdatedEvent`
- `InventoryLowStockEvent`

**Events Consumed:**
- `OrderCreatedEvent` (from Order Service)
- `OrderCancelledEvent` (from Order Service)
- `PaymentFailedEvent` (from Payment Service)

**Business Logic:**
- Reserves inventory on order creation
- Releases inventory on cancellation
- Updates stock levels
- Monitors low stock thresholds

#### Notification Service (Port 3004, WebSocket 3005)

**Responsibilities:**
- WebSocket gateway for real-time updates
- Event aggregation and broadcasting
- Client connection management
- Notification routing

**Database:** None (stateless)

**Events Consumed:**
- All events from Order, Payment, and Inventory services

**Business Logic:**
- Subscribes to all system events
- Broadcasts events to connected clients
- Manages WebSocket connections
- Handles client authentication (future)

### 3. Frontend Layer

#### Next.js Application (Port 3000)

**Responsibilities:**
- User interface
- Real-time order tracking
- Order management UI
- Dashboard and analytics

**Technologies:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Socket.io-client (WebSocket)

**Features:**
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Real-time updates via WebSocket
- Responsive design

### 4. Shared Libraries Layer

#### @eventflow/common

**Purpose:** Shared types, DTOs, interfaces, and enums

**Contents:**
- **DTOs (Data Transfer Objects)**
  - `CreateOrderDto`, `UpdateOrderDto`, `OrderDto`
  - `CreatePaymentDto`, `UpdatePaymentDto`, `PaymentDto`
  - `ReserveInventoryDto`, `InventoryDto`
  
- **Enums**
  - `OrderStatus`: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED
  - `PaymentStatus`: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED
  - `InventoryStatus`: AVAILABLE, RESERVED, OUT_OF_STOCK, DISCONTINUED
  
- **Interfaces**
  - `BaseEntity`: Common entity structure
  - `PaginationParams`, `PaginatedResponse`: Pagination support
  - `ApiResponse`: Standard API response format
  
- **Errors**
  - `BaseError`, `ValidationError`, `NotFoundError`, `ConflictError`

**Usage:** Imported by all services and frontend for type safety

#### @eventflow/events

**Purpose:** Event definitions and RabbitMQ constants

**Contents:**
- **Event Classes**
  - Order Events: `OrderCreatedEvent`, `OrderUpdatedEvent`, `OrderCancelledEvent`
  - Payment Events: `PaymentInitiatedEvent`, `PaymentProcessedEvent`, `PaymentFailedEvent`, `PaymentRefundedEvent`
  - Inventory Events: `InventoryReservedEvent`, `InventoryReleasedEvent`, `InventoryUpdatedEvent`, `InventoryLowStockEvent`
  
- **Constants**
  - `EventPatterns`: RabbitMQ routing keys
  - `Queues`: Queue names
  - `Exchanges`: Exchange names

**Usage:** Used by all services for event publishing and consumption

#### @eventflow/utils

**Purpose:** Shared utility functions

**Contents:**
- **Logger Service**: Structured logging with Winston
- **Validators**: UUID validation, Email validation
- **Date Helpers**: Date manipulation and formatting utilities

**Usage:** Shared utilities across all services

---

## Technology Stack

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **NestJS** | Microservices framework | Latest |
| **TypeScript** | Type-safe development | 5.3+ |
| **TypeORM/Prisma** | Database ORM | Latest |
| **RabbitMQ** | Message broker | 3.12 |
| **PostgreSQL** | Relational database | 15 |
| **Redis** | Caching & queues | 7 |

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework | 14+ |
| **TypeScript** | Type-safe development | 5.3+ |
| **Tailwind CSS** | Styling | Latest |
| **Socket.io-client** | WebSocket client | Latest |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local orchestration |
| **Yarn Workspaces** | Monorepo management |

---

## Project Structure

```
EventFlow/
├── docker-compose.yml              # Infrastructure orchestration
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment template
├── package.json                    # Root workspace configuration
├── yarn.lock                       # Dependency lock file
│
├── shared/                         # Shared Libraries (Monorepo)
│   ├── common/                     # @eventflow/common
│   │   ├── src/
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── enums/              # Enumerations
│   │   │   ├── interfaces/         # TypeScript interfaces
│   │   │   ├── errors/             # Error classes
│   │   │   └── index.ts
│   │   ├── dist/                   # Compiled output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── events/                     # @eventflow/events
│   │   ├── src/
│   │   │   ├── order/              # Order events
│   │   │   ├── payment/            # Payment events
│   │   │   ├── inventory/          # Inventory events
│   │   │   ├── constants/          # RabbitMQ constants
│   │   │   └── index.ts
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── utils/                      # @eventflow/utils
│       ├── src/
│       │   ├── logger/             # Logger service
│       │   ├── validators/         # Validation utilities
│       │   ├── date/               # Date helpers
│       │   └── index.ts
│       ├── dist/
│       ├── package.json
│       └── tsconfig.json
│
├── services/                       # Microservices (To be created)
│   ├── order-service/              # Order Management Service
│   │   ├── src/
│   │   │   ├── main.ts            # Application entry
│   │   │   ├── app.module.ts      # Root module
│   │   │   ├── order/             # Order module
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── order.entity.ts
│   │   │   │   └── order.module.ts
│   │   │   ├── events/            # Event handlers
│   │   │   └── config/            # Configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── payment-service/            # Payment Processing Service
│   ├── inventory-service/          # Inventory Management Service
│   └── notification-service/      # WebSocket Gateway Service
│
└── frontend/                       # Frontend Application (To be created)
    └── nextjs-app/
        ├── app/                    # Next.js App Router
        ├── components/             # React components
        ├── lib/                    # Utilities
        ├── public/                 # Static assets
        ├── package.json
        └── tsconfig.json
```

---

## Communication Patterns

### 1. Synchronous Communication (HTTP/REST)

**Used for:**
- Client-to-service direct requests
- Service-to-service synchronous calls (when needed)
- API endpoints

**Example:**
```
Client → Order Service (HTTP POST /orders)
Order Service → Client (HTTP 201 Created)
```

### 2. Asynchronous Communication (RabbitMQ)

**Used for:**
- Service-to-service event communication
- Decoupled service interactions
- Event-driven workflows

**Pattern:**
```
Service A → RabbitMQ Exchange → Queue → Service B
```

**Example:**
```
Order Service → Publishes OrderCreatedEvent → RabbitMQ
Inventory Service → Consumes OrderCreatedEvent → Reserves Inventory
```

### 3. Real-time Communication (WebSocket)

**Used for:**
- Frontend real-time updates
- Live notifications
- Order status updates

**Pattern:**
```
Service → Notification Service → WebSocket → Frontend Client
```

**Example:**
```
Payment Service → Publishes PaymentProcessedEvent → RabbitMQ
Notification Service → Consumes Event → Broadcasts via WebSocket
Frontend → Receives real-time update
```

---

## Data Flow

### Order Creation Flow

```
1. Client → HTTP POST /orders → Order Service
   │
   ├─→ Order Service validates request
   ├─→ Order Service creates order in order_db
   ├─→ Order Service publishes OrderCreatedEvent → RabbitMQ
   │
   ├─→ Inventory Service consumes OrderCreatedEvent
   │   ├─→ Reserves inventory in inventory_db
   │   └─→ Publishes InventoryReservedEvent → RabbitMQ
   │
   ├─→ Payment Service consumes OrderCreatedEvent
   │   ├─→ Initiates payment in payment_db
   │   └─→ Publishes PaymentInitiatedEvent → RabbitMQ
   │
   └─→ Notification Service consumes all events
       └─→ Broadcasts via WebSocket → Frontend
```

### Payment Processing Flow

```
1. Payment Service processes payment
   │
   ├─→ If successful:
   │   ├─→ Updates payment status in payment_db
   │   ├─→ Publishes PaymentProcessedEvent → RabbitMQ
   │   │
   │   └─→ Order Service consumes PaymentProcessedEvent
   │       └─→ Updates order status to CONFIRMED
   │
   └─→ If failed:
       ├─→ Updates payment status in payment_db
       ├─→ Publishes PaymentFailedEvent → RabbitMQ
       │
       └─→ Inventory Service consumes PaymentFailedEvent
           └─→ Releases reserved inventory
```

### Order Cancellation Flow

```
1. Client → HTTP DELETE /orders/:id → Order Service
   │
   ├─→ Order Service updates order status to CANCELLED
   ├─→ Order Service publishes OrderCancelledEvent → RabbitMQ
   │
   ├─→ Inventory Service consumes OrderCancelledEvent
   │   └─→ Releases reserved inventory
   │
   └─→ Payment Service consumes OrderCancelledEvent
       └─→ Initiates refund if payment was processed
```

---

## Event-Driven Architecture

### Event Types

#### Domain Events
Events that represent business occurrences:
- `OrderCreatedEvent`
- `PaymentProcessedEvent`
- `InventoryReservedEvent`

#### Integration Events
Events that coordinate between services:
- `OrderUpdatedEvent`
- `PaymentFailedEvent`
- `InventoryLowStockEvent`

### Event Flow Pattern

```
┌─────────────┐
│   Service   │
│   (Source)   │
└──────┬───────┘
       │
       │ Publishes Event
       ▼
┌─────────────────┐
│  RabbitMQ       │
│  Exchange       │
└──────┬──────────┘
       │
       │ Routes to Queue
       ▼
┌─────────────────┐
│  RabbitMQ       │
│  Queue          │
└──────┬──────────┘
       │
       │ Consumes Event
       ▼
┌─────────────┐
│   Service   │
│  (Consumer)  │
└─────────────┘
```

### Event Routing

**RabbitMQ Routing:**
- **Exchanges**: `order_exchange`, `payment_exchange`, `inventory_exchange`
- **Queues**: `order_queue`, `payment_queue`, `inventory_queue`, `notification_queue`
- **Routing Keys**: `order.created`, `payment.processed`, `inventory.reserved`

**Example:**
```typescript
// Order Service publishes
this.client.emit('order.created', orderCreatedEvent);

// Inventory Service subscribes
@EventPattern('order.created')
async handleOrderCreated(data: OrderCreatedEvent) {
  // Reserve inventory
}
```

---

## Design Patterns

### 1. Microservices Pattern

**Implementation:**
- Each service is independently deployable
- Services have their own database
- Services communicate via events

**Benefits:**
- Technology diversity
- Independent scaling
- Fault isolation

### 2. Event Sourcing (Partial)

**Implementation:**
- Events are published for all state changes
- Services can replay events to rebuild state
- Event history provides audit trail

**Benefits:**
- Complete audit trail
- Event replay capability
- Temporal queries

### 3. Saga Pattern

**Implementation:**
- Distributed transactions across services
- Compensating actions for rollback
- Event-driven coordination

**Example:**
```
Order Created → Reserve Inventory → Process Payment
If Payment Fails → Release Inventory (Compensating Action)
```

### 4. API Gateway Pattern

**Implementation:**
- Notification Service acts as WebSocket gateway
- Aggregates events from multiple services
- Single entry point for real-time updates

**Benefits:**
- Simplified client communication
- Centralized authentication
- Request/response transformation

### 5. CQRS (Command Query Responsibility Segregation)

**Implementation:**
- Commands (writes) via HTTP/REST
- Queries (reads) via HTTP/REST
- Events (notifications) via RabbitMQ/WebSocket

**Benefits:**
- Optimized read/write paths
- Scalability
- Clear separation of concerns

### 6. Repository Pattern

**Implementation:**
- TypeORM/Prisma repositories
- Data access abstraction
- Testability

### 7. Dependency Injection

**Implementation:**
- NestJS built-in DI container
- Service injection
- Module-based organization

---

## Scalability & Performance

### Horizontal Scaling

**Services:**
- Each microservice can scale independently
- Multiple instances behind load balancer
- Stateless services (except database connections)

**Example:**
```
Order Service: 3 instances
Payment Service: 2 instances
Inventory Service: 5 instances
```

### Database Scaling

**Strategies:**
- Read replicas for read-heavy services
- Connection pooling
- Database indexing
- Query optimization

### Caching Strategy

**Redis Usage:**
- Frequently accessed data caching
- Session storage
- Rate limiting
- Cache invalidation on updates

### Performance Optimizations

1. **Database:**
   - Indexes on frequently queried fields
   - Connection pooling
   - Query optimization

2. **RabbitMQ:**
   - Message persistence
   - Queue durability
   - Consumer prefetch limits

3. **Frontend:**
   - SSR/ISR for product pages
   - Code splitting
   - Image optimization
   - CDN for static assets

### Load Handling

**Expected Capacity:**
- Order Service: 1000 orders/second
- Payment Service: 500 payments/second
- Inventory Service: 2000 inventory checks/second

**Scaling Triggers:**
- CPU usage > 70%
- Memory usage > 80%
- Response time > 500ms
- Queue depth > 1000 messages

---

## Security Considerations

### Authentication & Authorization

**Planned Implementation:**
- JWT tokens for API authentication
- Role-based access control (RBAC)
- Service-to-service authentication

### Data Security

**Measures:**
- Environment variables for secrets
- Database connection encryption
- HTTPS for all external communication
- Input validation and sanitization

### Network Security

**Measures:**
- Docker network isolation
- Service-to-service communication within Docker network
- Firewall rules
- Rate limiting

### Event Security

**Measures:**
- Event validation
- Message encryption (future)
- Access control for RabbitMQ
- Audit logging

---

## Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────┐
│         Docker Compose                   │
│  ┌──────────┐  ┌──────────┐  ┌──────┐ │
│  │PostgreSQL│  │ RabbitMQ │  │Redis │ │
│  │  (x3)    │  │          │  │      │ │
│  └──────────┘  └──────────┘  └──────┘ │
└─────────────────────────────────────────┘
         │
         │ Local Network
         ▼
┌─────────────────────────────────────────┐
│      Services (Local Development)        │
│  Order │ Payment │ Inventory │ Notify   │
└─────────────────────────────────────────┘
         │
         │ HTTP/WebSocket
         ▼
┌─────────────────────────────────────────┐
│         Next.js Frontend                │
│         (Local Port 3000)               │
└─────────────────────────────────────────┘
```

### Production Environment (Planned)

```
┌─────────────────────────────────────────┐
│         Load Balancer                   │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌─────────┐
│  API    │         │  Web    │
│ Gateway │         │  App    │
└────┬────┘         └────┬────┘
     │                   │
     ▼                   ▼
┌─────────────────────────────────────────┐
│      Kubernetes Cluster                 │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Order   │  │ Payment │  │Inventory││
│  │ Service  │  │ Service  │  │ Service ││
│  │  (x3)    │  │  (x2)   │  │  (x5)   ││
│  └────┬─────┘  └────┬────┘  └────┬────┘│
└───────┼─────────────┼─────────────┼─────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────┐
│      Managed Databases                   │
│  PostgreSQL │ PostgreSQL │ PostgreSQL  │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│      Message Broker                     │
│      RabbitMQ Cluster                   │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│      Cache Layer                        │
│      Redis Cluster                      │
└─────────────────────────────────────────┘
```

---

## Monitoring & Observability

### Logging

**Implementation:**
- Structured logging with Winston
- Centralized log aggregation (future)
- Log levels: ERROR, WARN, INFO, DEBUG

### Metrics

**Planned:**
- Service health endpoints
- Response time metrics
- Queue depth monitoring
- Database connection pool metrics

### Tracing

**Planned:**
- Distributed tracing (OpenTelemetry)
- Request correlation IDs
- Event traceability

### Alerting

**Planned:**
- Service downtime alerts
- High error rate alerts
- Queue backlog alerts
- Database connection alerts

---

## Future Enhancements

### Phase 2
- [ ] User authentication and authorization
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced analytics dashboard

### Phase 3
- [ ] Kubernetes deployment
- [ ] Service mesh (Istio)
- [ ] Distributed tracing
- [ ] Advanced monitoring

### Phase 4
- [ ] Multi-region deployment
- [ ] Disaster recovery
- [ ] Advanced caching strategies
- [ ] GraphQL API

---

## Conclusion

EventFlow is designed as a **scalable, maintainable, and resilient** order processing system. The event-driven microservices architecture ensures:

- **Loose Coupling**: Services communicate via events
- **High Availability**: Service failures don't cascade
- **Scalability**: Independent service scaling
- **Real-time Updates**: WebSocket gateway for instant notifications
- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated services are easier to test

The architecture supports future growth and can handle increasing load through horizontal scaling and optimized communication patterns.

---

**Last Updated:** 2024
**Version:** 1.0.0
**Maintainer:** EventFlow Team
