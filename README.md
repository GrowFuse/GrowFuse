# Monorepo Project Setup Guide

This guide will help you set up the monorepo project locally using Docker, Bun, and Turborepo.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Bun](https://bun.sh/)

## Project Structure

The project is organized as a monorepo using Turborepo:

```
.
├── apps
│   ├── web (Vite + React)
│   └── server (Hono + Bun)
├── packages
│   ├── db (Prisma for migrations and Kysely query builder)
│   ├── auth (Lucia-auth module)
│   ├── email (React email components)
│   └── ui (Shadcn components, Tailwind configs)
└── tooling
    └── typescript
```

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

## Running the Project

You can run the projects separately or all at once:

- To run the web application:

  ```bash
  bun dev:web
  ```

- To run the server:

  ```bash
  bun dev:server
  ```

  This will start the following services:

  - PostgreSQL database
  - MailHog (for email testing)

- To run everything at once:

  ```bash
  bun dev
  ```

## Development

The projects are configured with hot reloading. Any changes you make to the source files will automatically trigger a restart of the respective service.

## Stopping the Services

To stop the Docker containers, run:

```bash
docker-compose down
```

To stop the containers and remove the volumes (this will delete all data in the database):

```bash
docker-compose down -v
```

## Linting

We use Biome for linting across the monorepo. To run the linter:

```bash
bun lint
```

## Notes

- Make sure to update the `.env` file with your specific configuration if needed.
- The PostgreSQL data is persisted in a Docker volume named `postgres_data`.
- The web application (Vite + React) will be available at `http://localhost:5173` by default.
- The server (Hono) will be available at `http://localhost:3000`.
- The React Email client will be available at `http://localhost:3003`.
- MailHog UI for email testing: `http://localhost:8025`
