# Novice Ink. Writer's Club

**A modern archival reconstruction of the original Novice Ink. Writer's Club website.**

Novice Ink. Writer's Club was originally developed as a high school club for aspiring writers to share their creativity, publish stories, and connect with fellow members.

I first made this website for my high school's writers' club around 2021, when I was just starting out with full-stack web development and was completely new to it all. The original used Firebase for authentication and the database, with Express.js and EJS for the application.

This project revisits that original website, rebuilding it from the ground up using modern full-stack technologies and the software engineering practices I've learned since its initial development. It is an opportunity to apply better backend and frontend practices that younger me wasn't fully aware of and to show how far I've come.

Unlike the original application, this reconstruction is **not intended to operate as an active writing community**. Instead, it serves as a digital archive, preserving previously published stories, original member profiles, and the identity of Novice Ink Club.

## Project Goals

The primary objectives of this reconstruction are to:

- **Preserve the original community:** Retain previously published stories, historical content, and legacy member profiles.
- **Modernize the architecture:** Replace the original Express.js, EJS, and Firebase implementation with a more maintainable full-stack architecture.
- **Demonstrate technical growth:** Apply improved practices in authentication, authorization, database design, API development, and frontend architecture.
- **Maintain the original identity:** Recreate and refine the original website's experience without unnecessarily expanding its scope.

## Project Scope

This project is primarily an archival showcase rather than a fully operational publishing platform.

Core account functionality, such as authentication and profile customization, is implemented to demonstrate the rebuilt application's architecture. Historical content, including previously published stories and legacy member profiles, is preserved for browsing.

Features that previously supported an active community, such as story submissions, editorial administration, and content publishing workflows, are intentionally excluded from the reconstruction.

These limitations are deliberate design decisions reflecting the project's archival purpose, rather than incomplete functionality.

## Tech Stack

### Backend

- **NestJS** and **TypeScript** for the API.
- **PostgreSQL**, hosted on **Neon**, with **Drizzle ORM** for database access and schema management.
- **Redis** for refresh-token session data and short-lived codes that benefit from frequent reads and expiration.
- **JWT authentication** using access and refresh tokens, with email verification.
- **Resend** for verification and password-reset emails.

### Frontend

- **React**, **Vite**, and **TypeScript**.
- **Tailwind CSS** for styling.

### Shared and Tooling

- **`@repo/shared-types`** for types and schemas shared by the frontend and backend.
- **Zod** for runtime validation with reusable schemas in the shared package.
- **npm workspaces** and **Turborepo** for managing the monorepo.

## Repository Structure

```text
.
├── apps/
│   ├── backend/          # NestJS API, authentication, Redis, and PostgreSQL
│   └── frontend/         # React + Vite + Tailwind CSS
├── packages/
│   └── shared-types/     # @repo/shared-types
│       └── src/
│           ├── types/    # Shared domain and API types
│           ├── hooks/    # Shared hook types
│           ├── enums/    # Shared enums
│           ├── schemas/  # Shared validation schemas
│           └── index.ts  # Re-exports shared definitions
├── package.json          # Root workspace scripts and dependencies
├── package-lock.json     # Single lockfile for the monorepo
├── turbo.json            # Turbo task pipeline
└── README.md
```

Dependencies are managed at the repository root, while the frontend and backend remain separate applications. Add shared definitions under `packages/shared-types/src`, organize them by kind, and re-export them from `packages/shared-types/src/index.ts` for consumption through `@repo/shared-types`.

## Prerequisites

- Node.js (LTS recommended) and npm (v7 or newer for workspaces).
- A [Neon](https://neon.tech/) account and PostgreSQL database.
- A running Redis instance.
- A [Resend](https://resend.com/) account and an appropriate sender for verification and password-reset emails.

## Installation

From the **repository root**:

```bash
npm install
```

This installs dependencies for all workspace packages using the root lockfile. Do not run `npm install` inside individual apps.

## Environment Setup

Use the example files as the source of truth for each application's configuration:

- [Backend environment example](apps/backend/.env.example)
- [Frontend environment example](apps/frontend/.env.example)

From the repository root, copy both examples and fill in the values for your setup:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Configure the backend to connect to your Neon database and running Redis instance, and provide the email service configuration needed to send verification and password-reset emails. Configure the frontend to reach the backend.

Do not commit local `.env` files or expose backend credentials in frontend configuration.

## Redis Setup

Install [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/) if it is not already available, then start the server in a terminal:

```bash
redis-server
```

Leave that terminal running. In another terminal, connect to the server:

```bash
redis-cli
```

At the Redis prompt, run `PING` to check the connection; a running server should respond with `PONG`. Type `exit` to leave the CLI. Make sure the backend configuration in the [environment example](apps/backend/.env.example) points to your Redis instance.

## Neon PostgreSQL Setup

1. Create an account at [Neon](https://neon.tech/) and create a PostgreSQL project.
2. Select the project's database and copy the PostgreSQL connection string provided by Neon.
3. Add that connection string to the backend `.env` file using the corresponding entry in the [backend environment example](apps/backend/.env.example). Keep it confidential because it contains database credentials.
4. Apply the database schema using the Drizzle migration workflow below.

## Drizzle ORM Setup

The backend uses [Drizzle ORM](https://orm.drizzle.team/) to define and manage the PostgreSQL schema. The schema is defined in [`apps/backend/src/schema.ts`](apps/backend/src/schema.ts), and Drizzle Kit is configured in [`apps/backend/src/config/drizzle.config.ts`](apps/backend/src/config/drizzle.config.ts).

Run the following commands from `apps/backend`. Drizzle's configuration reads from the process environment, so make the backend `.env` values available in your shell first. For a shell-compatible `.env` file:

```bash
cd apps/backend
set -a
. ./.env
set +a
```

### Generate and Apply Migrations

After making a schema change, generate a migration:

```bash
npm run db:generate
```

Or run Drizzle Kit directly:

```bash
npx drizzle-kit generate --config src/config/drizzle.config.ts
```

Apply generated migrations to Neon:

```bash
npm run db:migrate
```

Or run the migration command directly:

```bash
npx drizzle-kit migrate --config src/config/drizzle.config.ts
```

### Push Schema Changes Directly

For development, you can push the current schema to the database without generating migration files:

```bash
npm run db:push
```

Use `db:generate` followed by `db:migrate` for changes that should be tracked as migrations. `db:generate` only creates migration files; `db:migrate` applies them. `db:push` applies the current schema directly without generating migration files.

## Development

Start Redis, then run all development servers from the repository root:

```bash
npm run dev
```

Turbo starts the NestJS backend and Vite frontend, builds and watches `@repo/shared-types`, and streams logs with app prefixes.

### Rebuilding Shared Types

The root `npm run dev` command starts the shared-types watcher automatically; no separate terminal is needed. If you run an individual app's development script instead, start the watcher separately from the repository root:

```bash
npm run dev --workspace=@repo/shared-types
```

Leave it running to rebuild `dist` automatically as the shared types change.

### Default Ports

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Ensure the frontend and backend configuration matches the URLs you use locally.

## Authentication

The application uses email and password authentication, including email verification. After authentication, the backend issues JWT access and refresh tokens: access tokens authenticate API requests, while refresh tokens allow sessions to obtain new tokens. Redis stores refresh-token session data and temporary codes, such as email verification codes, that need quick reads and expiration.
