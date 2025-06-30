# Git Submodules Approach

## Setup
```bash
# Create shared schema repository
mkdir furnerio-schema
cd furnerio-schema
git init
# Add your schema.prisma file
git add .
git commit -m "Initial schema"
git remote add origin <your-repo-url>
git push -u origin main

# Add submodule to admin dashboard
cd /path/to/admin-dashboard
git submodule add <schema-repo-url> shared/database

# Add submodule to web store
cd /path/to/web-store  
git submodule add <schema-repo-url> shared/database

# Create symlinks
ln -s shared/database/schema.prisma prisma/schema.prisma
```

## Update Process
```bash
# Update schema in one place
cd shared/database
# Make changes
git commit -m "Update schema"
git push

# Update in other projects
cd /path/to/other-project
git submodule update --remote
```

## Pros/Cons
✅ Quick to implement
✅ No major restructuring needed
❌ Git submodules can be complex
❌ Manual sync required
