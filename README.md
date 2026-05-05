# 🌊 FlowCore

**FlowCore** is a high-performance, self-hostable AI automation engine designed for modern developers. Build, test, and deploy complex AI-driven workflows with a premium drag-and-drop interface and a robust distributed execution backend.

---

## ✨ Key Features

- **🎨 Premium Visual Editor**: A sleek, dark-mode first canvas for designing automations.
- **🤖 AI Native**: First-class support for LLM steps (GPT-4) with dynamic context injection.
- **⛓️ Execution Tracing**: Deep visibility into every step of your workflow with real-time logs.
- **⚡ Distributed Architecture**: Powered by Fastify, BullMQ, and Redis for horizontal scalability.
- **🔒 Secure Auth**: Built-in multi-tenant authentication powered by Better Auth.
- **📈 Insightful Dashboard**: High-level overview of your automation performance and success rates.

## 🏗️ Architecture

FlowCore is built with a modern monorepo structure, ensuring type safety from the database to the UI.

```text
                                  ┌───────────────┐
                                  │   Next.js UI  │
                                  └───────┬───────┘
                                          ▼
                                  ┌───────────────┐
      ┌────────────┐              │  Fastify API  │              ┌────────────┐
      │  Postgres  │ ◄────────────┤  (Prisma ORM) ├────────────► │ Better Auth│
      └────────────┘              └───────┬───────┘              └────────────┘
                                          ▼
                                  ┌───────────────┐
                                  │ BullMQ Queue  │
                                  └───────┬───────┘
                                          ▼
                                  ┌───────────────┐
                                  │ Redis Broker  │
                                  └───────┬───────┘
                                          ▼
                                  ┌───────────────┐
                                  │ Engine Worker │──► [ LLM / External APIs ]
                                  └───────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose**
- **Bun** (recommended) or Node.js 20+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/harmenx/flowcore.git
   cd flowcore
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY to the .env file
   ```

3. **Spin up the infrastructure**
   ```bash
   docker compose up -d
   ```

4. **Install dependencies and migrate DB**
   ```bash
   bun install
   cd apps/api
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   bun dev
   ```

Access the dashboard at `http://localhost:3000`.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, Zustand
- **Backend**: Fastify, Prisma (PostgreSQL), BullMQ (Redis)
- **Shared**: TypeScript (Monorepo shared types)
- **Automation**: AI SDK (OpenAI)

## 📄 License

MIT © [Harmen](https://github.com/harmenx)
