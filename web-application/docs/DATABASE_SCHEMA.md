# Database Schema for GlobalBites Authentication

This document outlines the database schema required for NextAuth.js with email/password and OAuth providers.

## Database Choice
**Recommended: PostgreSQL** (v12 or higher)
- Robust relational database
- Excellent JSON support
- Great for production use

## Schema Design

### 1. Users Table
Stores user account information.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  image TEXT,
  password TEXT,  -- Only for credentials provider (hashed with bcrypt)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. Accounts Table
Links users to OAuth providers (Google, GitHub, etc.).

```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'oauth', 'email', 'credentials'
  provider TEXT NOT NULL,  -- 'google', 'github', 'credentials'
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE UNIQUE INDEX idx_accounts_provider ON accounts(provider, provider_account_id);
```

### 3. Sessions Table (Optional - only if using database sessions)
Stores active sessions. **Not needed if using JWT strategy** (which we are).

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
```

### 4. Verification Tokens Table
For email verification and password reset.

```sql
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,  -- Email address
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (identifier, token)
);

CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
```

---

## Prisma Schema (Alternative)

If you prefer using Prisma ORM:

\`\`\`prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // For credentials provider
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
\`\`\`

---

## Migration Steps

### Using Raw SQL:
1. Create PostgreSQL database:
   ```bash
   createdb globalbites
   ```

2. Run schema creation:
   ```bash
   psql globalbites < schema.sql
   ```

### Using Prisma:
1. Install Prisma:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. Copy the Prisma schema above to `prisma/schema.prisma`

3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

---

## Current Setup Notes

**Current Strategy: JWT Sessions**
- No database required for sessions
- User data stored in JWT token
- Sessions stored client-side (encrypted)
- Mock user for development: `test@globalbites.com` / `password123`

**When to Add Database:**
1. When you want to store user profiles
2. When implementing user registration
3. When adding OAuth provider linking
4. When needing email verification
5. When tracking user activity/recipes

---

## Next Steps

1. **For Development (Current):**
   - Continue using JWT + mock user
   - Test OAuth providers with test credentials
   - Build UI integration

2. **For Production:**
   - Set up PostgreSQL database
   - Run migrations (Prisma recommended)
   - Update `authorize()` function in NextAuth to query database
   - Implement user registration endpoint
   - Add email verification flow
   - Add password reset functionality
