# FlowCore

Self-hostable AI workflow automation.

## Arch
```text
[ Web UI ] <-> [ Fastify API ] <-> [ Postgres ]
                     |
                [ BullMQ ] <-> [ Redis ]
                     |
              [ Worker Nodes ] -> [ LLM / External APIs ]
```

## Setup
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npx prisma migrate dev` (run from apps/api)

## Development
- `apps/web`: Next.js frontend
- `apps/api`: Fastify backend
- `packages/shared`: Shared types and utils
