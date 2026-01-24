# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a Nuxt 4 application with Turso (LibSQL) database, Drizzle ORM, and Cloudflare Workers deployment. The project uses Vue 3, TypeScript, and follows a modular API route structure.

## Build, Lint, and Test Commands

### Package Manager
This project uses **pnpm** as the package manager. Run all commands with `pnpm`.

### Development
```bash
pnpm dev              # Start development server on http://localhost:3000
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build locally with Wrangler
pnpm deploy           # Build and deploy to Cloudflare Workers
pnpm cf-typegen       # Generate Cloudflare Worker type definitions
```

### Database Migrations
```bash
# Generate and push migrations to Turso
npx drizzle-kit push
# Generate migration files only
npx drizzle-kit generate
# Open Turso shell
npx turso shell
```

### Testing
This project does not have a configured test framework. When adding tests, use:
```bash
# Run all tests
pnpm test
# Run a single test file
pnpm test -- test-file.test.ts
# Watch mode
pnpm test:watch
```

## Code Style Guidelines

### TypeScript
- Enable **strict mode** in `tsconfig.json`
- Define explicit return types for API handlers and utility functions
- Use type inference for obvious cases (e.g., `const users = db.select().from(users)`)
- Import types explicitly: `import type { User } from './types'`

### Naming Conventions
- **Files**: kebab-case for Vue components (`user-list.vue`), PascalCase for utilities (`db.ts`)
- **Variables/Constants**: camelCase (`newUser`, `userList`)
- **Database Schema**: snake_case columns in Drizzle schema
- **API Routes**: RESTful naming (`users.get.ts`, `users.post.ts`)
- **Exports**: Named exports preferred for utilities

### Imports
- Organize imports in this order:
  1. Node.js built-ins
  2. Third-party libraries (Drizzle, LibSQL, Vue, Nuxt)
  3. Project modules (schema, utils)
- Use absolute imports with `~/` alias for project root imports
- Example:
  ```typescript
  import { users } from '~/server/database/schema'
  import { useDb } from '~/server/utils/db'
  ```

### API Handlers
- Use Nuxt's `defineEventHandler` for server routes
- Always wrap database operations in try/catch
- Return proper HTTP errors with `createError`
- Access body with `readBody(event)` for POST requests
- Example structure (see `server/api/users.post.ts`):
  ```typescript
  export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const db = useDb()
    try {
      const result = await db.insert(users).values({...}).returning().get()
      return result
    } catch (e: any) {
      console.log('Error context', e)
      throw createError({ statusCode: 400, statusMessage: e.message })
    }
  })
  ```

### Database Operations
- Use Drizzle ORM with typed schema (`server/database/schema.ts`)
- Export schemas from `server/database/schema.ts`
- Create reusable database utilities in `server/utils/db.ts`
- Use `useDb()` helper for database connections (automatically handles environment)

### Vue Components
- Use `<script setup>` syntax
- Use Composition API with `ref`, `computed`, `async`/`await`
- Handle loading and error states explicitly
- Example patterns (see `app/app.vue`):
  ```typescript
  const loading = ref(false)
  const addUser = async () => {
    loading.value = true
    try {
      await $fetch('/api/users', { method: 'POST', body: data })
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      loading.value = false
    }
  }
  ```

### Error Handling
- Never expose raw error messages to clients in production
- Log errors server-side before throwing
- Use appropriate HTTP status codes (400 for client errors, 500 for server errors)
- Validate input before database operations

### Environment Variables
- Use `runtimeConfig` in `nuxt.config.ts` for server-side secrets
- Access with `useRuntimeConfig()` in server context
- Never commit `.env` files (gitignored)
- Required variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

### Configuration Files
- `nuxt.config.ts`: Nuxt configuration, runtime config, Nitro presets
- `drizzle.config.ts`: Database connection for CLI migrations
- `wrangler.jsonc`: Cloudflare Workers deployment config
- `tsconfig.json`: TypeScript configuration (references `.nuxt/tsconfig.*.json`)

### Cloudflare Workers Specifics
- Use `cloudflare_module` Nitro preset
- Access Cloudflare context via `event.context.cloudflare`
- Be aware of Workers runtime limitations (no Node.js globals)
- Run `pnpm cf-typegen` after adding new bindings
