# Project Setup Guide

This guide will help you set up the project locally using Docker and Bun.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Bun](https://bun.sh/)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Apply database migrations:

   ```bash
   bun prisma db:push
   ```

5. Start the Docker containers:

   ```bash
   docker-compose up -d
   ```

This will start the following services:

- PostgreSQL database
- MailHog (for email testing)
- Hono server (running with Bun)

5. Access the services:
   - Hono server: http://localhost:3000
   - MailHog UI: http://localhost:8025

## Development

The Hono server is configured with hot reloading. Any changes you make to the source files will automatically trigger a restart of the server.

## Stopping the Services

To stop the Docker containers, run:

```bash
docker-compose down
```

To stop the containers and remove the volumes (this will delete all data in the database):

```bash
docker-compose down -v
```

## Notes

- Make sure to update the `.env` file with your specific configuration if needed.
- The PostgreSQL data is persisted in a Docker volume named `postgres_data`.
