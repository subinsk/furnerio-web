# Alternative: NPM Package Approach

## Create Shared Database Package

```bash
mkdir furnerio-database
cd furnerio-database
npm init -y
```

### package.json
```json
{
  "name": "furnerio-database",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "prisma"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build && npx prisma generate"
  },
  "dependencies": {
    "@prisma/client": "latest"
  },
  "peerDependencies": {
    "prisma": "latest"
  }
}
```

## Publish and Use

```bash
# Publish to npm (or private registry)
npm publish

# Install in both projects
npm install furnerio-database

# Use in your apps
import { prisma, PrismaClient } from 'furnerio-database'
```

## Update Process
1. Update schema in database package
2. Version bump and publish
3. Update dependency in both apps
4. Run migrations
