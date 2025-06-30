# Migration Guide: Monorepo with Shared Database Package

## Step 1: Create Monorepo Structure

```bash
# Create new project root
mkdir furnerio-monorepo
cd furnerio-monorepo

# Initialize root package.json
npm init -y

# Create packages directory
mkdir packages
mkdir packages/database
mkdir packages/admin-dashboard
mkdir packages/web-store
```

## Step 2: Setup Shared Database Package

```bash
cd packages/database
npm init -y
npm install prisma @prisma/client
```

### packages/database/package.json
```json
{
  "name": "@furnerio/database",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "migrate:reset": "prisma migrate reset",
    "generate": "prisma generate",
    "studio": "prisma studio",
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "prisma": "latest"
  },
  "devDependencies": {
    "tsx": "latest",
    "typescript": "latest"
  }
}
```

### packages/database/prisma/schema.prisma
```prisma
// Your unified schema here
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ... rest of your schema
```

### packages/database/index.ts
```typescript
export * from '@prisma/client'
export { PrismaClient } from '@prisma/client'

// Create a singleton instance
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Step 3: Update Applications

### Move your existing apps
```bash
# Move admin dashboard
mv /path/to/admin-dashboard/* packages/admin-dashboard/

# Move web store  
mv /path/to/furnerio-web/* packages/web-store/
```

### Update package.json in each app
```json
{
  "dependencies": {
    "@furnerio/database": "workspace:*",
    // ... other dependencies
  }
}
```

## Step 4: Setup Workspace Management

### Root package.json (using pnpm)
```json
{
  "name": "furnerio-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel dev",
    "build": "pnpm --recursive build",
    "db:migrate": "pnpm --filter @furnerio/database migrate:dev",
    "db:studio": "pnpm --filter @furnerio/database studio"
  },
  "devDependencies": {
    "typescript": "latest"
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - "packages/*"
```

## Step 5: Update Import Statements

Replace all Prisma imports in both apps:

```typescript
// Before
import { PrismaClient } from '@prisma/client'

// After  
import { PrismaClient, prisma } from '@furnerio/database'
```

## Benefits
- ✅ Single source of truth for database schema
- ✅ Automatic type sharing between apps
- ✅ Centralized database operations
- ✅ Easy to maintain and update
- ✅ Shared migrations and seeds
